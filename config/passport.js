const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook') // Facebook OAuth 2 登入策略
const GoogleStrategy = require('passport-google-oauth20').Strategy // Google OAuth 2 登入策略
const passportJWT = require('passport-jwt') // api 專用
const JWTStrategy = passportJWT.Strategy // api 專用
const ExtractJWT = passportJWT.ExtractJwt // api 專用
const bcrypt = require('bcryptjs')

// 載入 model
const { User } = require('../models')

// 實作本地登入策略
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

// 實作 Facebook OAuth2 登入策略
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
},
(accessToken, refreshToken, profile, cb) => {
  // 可以觀察物件結構
  // console.log('access token:', accessToken)
  // console.log('profile:', profile)

  const email = profile.emails[0].value
  const name = profile.displayName

  // 根據輸入帳密, 比對使用者資料表的資訊, 從資料表撈資料
  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email: email },
    raw: true
  })
    .then(user => {
      // 如果資料庫, 曾經有吻合使用者, 則直接進入下一步
      if (user) return cb(null, user)

      // 如果資料庫沒有相符合使用者, 則在資料路建立資料後進入下一步
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then(hash => User.create({ name, email, password: hash }))
        .then(user => cb(null, { id: user.id, name: user.name, email: user.email }))
    })
    .catch(err => {
      err.errorMessage = '登入失敗'
      return cb(err)
    })
}))

// Google OAuth2 登入策略
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
(accessToken, refreshToken, profile, cb) => {
  // 可以觀察物件結構
  // console.log('access token:', accessToken)
  // console.log('profile:', profile)

  const email = profile.emails[0].value
  const name = profile.displayName

  // 根據輸入帳密, 比對使用者資料表的資訊, 從資料表撈資料
  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email: email },
    raw: true
  })
    .then(user => {
      // 如果資料庫, 曾經有吻合使用者, 則直接進入下一步
      if (user) return cb(null, user)

      // 如果資料庫沒有相符合使用者, 則在資料路建立資料後進入下一步
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then(hash => User.create({ name, email, password: hash }))
        .then(user => cb(null, { id: user.id, name: user.name, email: user.email }))
    })
    .catch(err => {
      err.errorMessage = '登入失敗'
      return cb(err)
    })
}))

// 在 passport 設定序列化
passport.serializeUser((user, cb) => cb(null, user.id))

// 在 passport 設定反序列化
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    attributes: { exclude: ['password'] } // 避免密碼外洩
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

// 設計 jwt 的登入策略的 options
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// 設置 jwt 登入策略
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  // 在同步語法捕捉可能的錯誤事件
  try {
    // cb vs promise, 統一成其中一種風格
    console.log('登入的user資料', jwtPayload)
    cb(null, jwtPayload)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport
