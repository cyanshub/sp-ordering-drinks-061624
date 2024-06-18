// 載入所需 npm 套件
const bcrypt = require('bcryptjs')

// 載入所需 model
const { User, Cart, Drink, Store, Size, Sugar, Ice, Order } = require('../models')

// 載入所需工具
const { localAvatarHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res, next) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    const Salt = 10
    if (password !== passwordCheck) throw new Error('請再次確認密碼是否輸入正確')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('使用者信箱已經存在')
        return bcrypt.hash(password, Salt)
      })
      .then(hash => {
        User.create({
          name,
          email,
          password: hash,
          isAdmin: false
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res, next) => {
    return res.render('signin')
  },
  signIn: (req, res, next) => {
    // 實際的登入功能已經由 passport 以 middlewares 的形式處理
    req.flash('success_messages', '登入成功!')
    res.redirect('/stores')
  },
  logOut: (req, res, next) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON() // 整理 user 資料
        return res.render('profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    return User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.render('edit-user', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    const { name } = req.body
    if (!name.trim()) throw new Error('需要輸入使用者名稱!')
    const file = req.file // 根據之前修正的form content, 把檔案從req取出來
    return Promise.all([
      User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      }),
      localAvatarHandler(file) // 將圖案寫入指定資料夾, 並回傳圖檔路徑
    ])
      .then(([user, filePath]) => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          avatar: filePath || user.avatar
        })
      })
      .then(updatedUser => {
        req.flash('success_messages', '已變更成功!')
        res.redirect(`/users/${updatedUser.id}`)
        return { user: updatedUser }
      })
      .catch(err => next(err))
  },
  getAvatar: (req, res, next) => {
    const userId = req.params.userId
    return User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          avatar: null
        })
      })
      .then(updatedUser => {
        req.flash('success_messages', '成功移除頭像!')
        res.redirect('back')
        return { user: updatedUser }
      })
      .catch(err => next(err))
  },
  getCarts: (req, res, next) => {
    return Cart.findAll({
      raw: true,
      nest: true,
      where: { userId: req.user.id },
      include: [
        User, Drink, Store, Size, Sugar, Ice
      ]
    })
      .then(carts => {
        res.render('carts', { carts })
      })
  },
  addCart: (req, res, next) => {
    const userId = req.user.id
    const drinkId = Number(req.body.drinkId)
    const sizeId = Number(req.body.sizeId)
    const sugarId = Number(req.body.sugarId)
    const iceId = Number(req.body.iceId)
    const amount = Number(req.body.amount)

    if (!sizeId) throw new Error('請選擇中杯或大杯!')
    if (!sugarId) throw new Error('請選擇甜度!')
    if (!iceId) throw new Error('請選擇冰量!')
    if (!amount) throw new Error('請選擇購買杯數!')

    const storeId = Number(req.params.storeId)
    if (!storeId) throw new Error('店家不存在!')
    return Drink.findByPk(drinkId)
      .then(drink => {
        if (!drink) throw new Error('該商品不存在!')
        return Cart.create({
          userId,
          drinkId,
          sizeId,
          sugarId,
          iceId,
          amount,
          storeId
        })
      })
      .then(newCart => {
        req.flash('success_messages', '商品已成功加入購物車!')
        res.redirect('/carts')
        return { cart: newCart }
      })
      .catch(err => next(err))
  },
  removeCart: (req, res, next) => {
    const cartId = Number(req.params.cartId)
    return Cart.findByPk(cartId)
      .then(cart => {
        if (!cart) throw new Error('此購物車商品不存在!')
        return cart.destroy()
      })
      .then(deletedCart => {
        req.flash('success_messages', '成功退回訂單')
        res.redirect(`/stores/${deletedCart.storeId}`)
        return { cart: deletedCart }
      })
  },
  addOrders: (req, res, next) => {
    return Promise.all([
      Cart.findAll({ where: { userId: req.user.id }, raw: true }),
      Cart.findAll({ where: { userId: req.user.id } })
    ])
      .then(([carts, cartsToDelete]) => {
        if (!carts) throw new Error('購物車沒有商品!')
        carts.forEach(cart => {
          return Order.create({
            userId: cart.userId,
            drinkId: cart.drinkId,
            sizeId: cart.sizeId,
            sugarId: cart.sugarId,
            iceId: cart.iceId,
            amount: cart.amount,
            storeId: cart.storeId
          })
        })

        return cartsToDelete.forEach(cart => {
          return cart.destroy()
        })
      })
      .then(newOrders => {
        req.flash('success_messages', '商品訂單正式成立!')
        res.redirect('/orders')
        return { orders: newOrders }
      })
      .catch(err => next(err))
  },
  getOrders: (req, res, next) => {
    res.send('功能開發中!')
  }
}

module.exports = userController
