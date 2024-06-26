// 抽取 services 層
const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res, next) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    return userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號!')
      return res.redirect('/signin')
    })
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
    return userServices.getUser(req, (err, data) => err ? next(err) : res.render('profile', data))
  },
  editUser: (req, res, next) => {
    return userServices.editUser(req, (err, data) => err ? next(err) : res.render('edit-user', data))
  },
  putUser: (req, res, next) => {
    return userServices.putUser(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '已變更成功!')
      req.session.editedData = data
      return res.redirect(`/users/${data.user.id}`)
    })
  },
  putAvatar: (req, res, next) => {
    return userServices.putAvatar(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功移除頭像!')
      req.session.editedData = data
      return res.redirect('back')
    })
  },
  getCarts: (req, res, next) => {
    return userServices.getCarts(req, (err, data) => err ? next(err) : res.render('carts', data))
  },
  addCart: (req, res, next) => {
    return userServices.addCart(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '商品已成功加入購物車!')
      req.session.addedData = data
      return res.redirect('/carts')
    })
  },
  removeCart: (req, res, next) => {
    return userServices.removeCart(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功退回訂單')
      req.session.removedData = data
      return res.redirect(`/stores/${data.cart.storeId}`)
    })
  },
  addOrders: (req, res, next) => {
    return userServices.addOrders(req, (err, data) => {
      if (err) return next(err)
      req.session.addedData = data
      req.flash('success_messages', '已建立訂單, 並成功寄出郵件!')
      return res.redirect('/orders')
    })
  },
  getOrders: (req, res, next) => {
    return userServices.getOrders(req, (err, data) => err ? next(err) : res.render('orders', data))
  }
}

module.exports = userController
