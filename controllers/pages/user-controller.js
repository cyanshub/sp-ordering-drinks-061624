// 載入所需 npm 套件
const bcrypt = require('bcryptjs')

// 載入所需 model
const { User, Cart, Drink, Store, Size, Sugar, Ice, Order } = require('../../models')

// 載入所需工具
const { localAvatarHandler } = require('../../helpers/file-helpers')
const { getOffset, getPagination } = require('../../helpers/pagination-helpers')
const { Op, literal } = require('sequelize') // 引入 sequelize 查詢符、啟用 SQL 語法
const { convertToTaiwanTime } = require('../../helpers/array-helpers') // 自訂轉換時區工具
const nodemailer = require('nodemailer') // 寄件工具

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
    return res.redirect('/stores')
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
  putAvatar: (req, res, next) => {
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
        // 避免密碼外洩
        { model: User, attributes: { exclude: ['password'] } },
        Drink, Store, Size, Sugar, Ice
      ]
    })
      .then(carts => {
        // 確保時間為台灣時區
        const data = convertToTaiwanTime(carts)
        return res.render('carts', { carts: data })
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
    // 直接從 req.user 拿到所有訂單資訊
    return Promise.all([
      Cart.findAll({ where: { userId: req.user.id }, raw: true }),
      Cart.findAll({ where: { userId: req.user.id } })
    ])
      .then(([carts, cartsToDelete]) => {
        // 注意 forEach不會返回值; map才會!
        if (!carts) throw new Error('購物車沒有商品!')
        // 清空購物車資料
        cartsToDelete.forEach(cart => {
          return cart.destroy()
        })

        // 依據購物資料建立 order, 因為牽扯到非同步語法(create) 故要用 Promise傳遞
        const createOrderPromises = carts.map(cart => {
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
        return Promise.all(createOrderPromises)
      })
      .then(newOrders => {
        // 整理傳遞變數, 以便取得其id陣列, 並當作查詢條件, 重新取得帶有關聯資料的訂單
        const newOrderIds = newOrders.map(order => order.dataValues.id)
        const whereClause = { id: { [Op.in]: newOrderIds } }
        const includeClause = [
          { model: User, attributes: { exclude: ['password'] } },
          Drink, Store, Size, Sugar, Ice
        ]

        // 利用以上條件查詢, 因為是非同步語法, 所以要用 .then 傳遞
        return Order.findAll({
          where: whereClause,
          include: includeClause,
          raw: true,
          nest: true
        })
      })
      .then(newOrders => {
        // 得到帶有關聯資料的 newOrders, 建立郵件資訊
        const emailFrom = process.env.GMAIL_USER // 用來發送信件的 Gmail
        const emailTo = req.body.emailTo // 從表單取得收件人地址
        const emailSubject = '【通知】揪團訂飲料訂單成立'
        let msg = ''
        msg += '<p>您的訂單已成立, 訂購商品如下:</p><ul>'

        newOrders.forEach(order => {
          msg += `<li style="margin-left:0; padding-left:0;">${order.amount} 杯 <strong>${order.Size.level}</strong> ${order.Ice.level}、${order.Sugar.level}的 <strong>${order.Drink.name}</strong></li>`
        })

        msg += '</ul><p>此郵件為系統自動寄送, 請勿直接回覆, 謝謝!</p>'

        // 加上字體設定
        const emailMsgs = `
          <html>
            <body style="font-family: Arial, sans-serif; font-size: 14px;">
              ${msg}
            </body>
          </html>
        `
        const mailOptions = {
          from: emailFrom,
          to: emailTo,
          subject: emailSubject,
          html: emailMsgs
        }

        // 用應用程式密碼的方式通過 GOOGLE 驗證傳遞郵件
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER, // 要用來發送信件的 Gmail
            pass: process.env.GMAIL_PASS // 應用程式密碼
          }
        })

        // 將郵件發送出去
        return transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            next(err)
            res.status(500).send('Error sending email')
          } else {
            console.log(info)
            req.flash('success_messages', '已建立訂單, 並成功寄出郵件!')
            return res.redirect('/orders')
          }
        })
      })
      .catch(err => next(err))
  },
  getOrders: (req, res, next) => {
    const DEFAULT_LIMIT = 5 // 預設每頁顯示幾筆資料
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字

    // 關聯 literal 的 model 依 include 填寫的 model
    const whereClause = { // find系列語法查詢條件
      ...keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(Drink.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`DATE_ADD(Order.created_at, INTERVAL 8 HOUR) LIKE '%${keyword}%'`)
            ]
          }
        : {}
    }

    return Order.findAndCountAll({
      raw: true,
      nest: true,
      where: whereClause,
      order: [['id', 'DESC']], // 依建立時間降續排列
      include: [
        // 避免密碼外洩
        { model: User, attributes: { exclude: ['password'] } },
        Drink, Store, Size, Sugar, Ice],
      offset,
      limit
    })
      .then(orders => {
        // 確保時間為台灣時區
        const data = convertToTaiwanTime(orders.rows)
        return res.render('orders', {
          orders: data,
          pagination: getPagination(limit, page, orders.count),
          isSearched: '/orders', // 決定搜尋表單發送位置
          keyword,
          find: 'orders',
          count: orders.count
        })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
