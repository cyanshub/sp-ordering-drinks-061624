// 抽取 services 層
const userServices = require('../../services/user-services')

// 載入所需工具
const passport = require('../../config/passport')

const userController = {
  signUpPage: (req, res, next) => {
    return res.render('users/signup')
  },
  signUp: (req, res, next) => {
    return userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號!')
      return res.redirect('/signin')
    })
  },
  signInPage: (req, res, next) => {
    return res.render('users/signin')
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
  facebookSignInPage: (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next)
  },
  facebookSignIn: (req, res, next) => {
    passport.authenticate('facebook', (err, user, info) => {
      if (err) {
        console.error('Error authenticating with Facebook:', err)
        return res.status(500).send('Error authenticating with Facebook')
      }
      if (!user) {
        req.flash('error_messages', '登入失敗，請再試一次')
        return res.redirect('/signin')
      }
      req.logIn(user, err => {
        if (err) {
          console.error('Error logging in user:', err)
          return res.status(500).send('Error logging in user')
        }
        req.flash('success_messages', '登入成功!')
        return res.redirect('/stores')
      })
    })(req, res, next)
  },
  googleSignInPage: (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
  },
  googleSignIn: (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('Error authenticating with Google:', err)
        return res.status(500).send('Error authenticating with Google')
      }
      if (!user) {
        req.flash('error_messages', '登入失敗，請再試一次')
        return res.redirect('/signin')
      }
      req.logIn(user, err => {
        if (err) {
          console.error('Error logging in user:', err)
          return res.status(500).send('Error logging in user')
        }
        req.flash('success_messages', '登入成功!')
        return res.redirect('/stores')
      })
    })(req, res, next)
  },
  getUser: (req, res, next) => {
    return userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
  },
  editUser: (req, res, next) => {
    return userServices.editUser(req, (err, data) => err ? next(err) : res.render('users/edit-user', data))
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
    return userServices.getCarts(req, (err, data) => err ? next(err) : res.render('users/carts', data))
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
    return userServices.getOrders(req, (err, data) => err ? next(err) : res.render('users/orders', data))
  }
}

module.exports = userController
