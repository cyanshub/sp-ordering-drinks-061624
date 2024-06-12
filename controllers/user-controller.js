// 載入所需 npm 套件
const bcrypt = require('bcryptjs')

// 載入所需 model
const { User } = require('../models')

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
  }
}

module.exports = userController
