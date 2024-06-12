const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// 設置本地的登入策略 Set up passport strategy
passport.use(new LocalStrategy({
  usernameField: 'email', // 加入客製化參數 customize user field, 預設是 username
  passwordField: 'password',
  passReqToCallback: true // 要求把 req 傳給 callback
},
// 驗證使用者 Authenticate user
(req, email, password, cb) => {
  User.findOne({ where: { email } })
    .then(user => {
      // 先驗證帳號是否輸入正確: 若否則回傳 cb(null, false, ...)
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))

      // 驗證密碼是否正確輸入: 若否則回傳 cb(null, false, ...)
      return bcrypt.compare(password, user.password).then(res => {
        if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))
        // 當帳號存在, 且密碼一致才可回傳登入成功
        return cb(null, user)
      })
    })
}))

// 在 passport 設定序列化
passport.serializeUser((user, cb) => cb(null, user.id))

// 在 passport 設定反序列化
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    // 關聯 User Model 的多對多關係 Model, 並寫上多對多關係的名稱(對應model設定的名稱)
    include: []
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
