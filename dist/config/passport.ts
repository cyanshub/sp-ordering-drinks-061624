// 載入類型聲明文件
import { UserData } from '../typings/user-services'

// 載入 model
const { User } = require('../models')

// 載入所需工具
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt'
import bcrypt from 'bcryptjs'
import { Request } from 'express'
import dotenv from 'dotenv'

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// 實作本地登入策略
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req: Request, email: string, password: string, cb) => {
      User.findOne({ where: { email } })
        .then((user: UserData) => {
          if (!user) return cb(null, false, { message: '帳號或密碼輸入錯誤!' })

          return bcrypt.compare(password, user.password).then((res) => {
            if (!res) return cb(null, false, { message: '帳號或密碼輸入錯誤!' })
            return cb(null, user)
          })
        })
        .catch((err: Error) => cb(err))
    }
  )
)

// Google OAuth2 登入策略
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, cb) => {
      const email = profile.emails?.[0].value
      const name = profile.displayName

      if (!email) {
        return cb(new Error('No email found in Google profile'))
      }

      User.findOne({ where: { email }, attributes: ['id', 'name', 'email'], raw: true })
        .then((user: UserData) => {
          if (user) return cb(null, user)

          const randomPwd = Math.random().toString(36).slice(-8)
          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) => cb(null, { id: user.id, name: user.name, email: user.email }))
        })
        .catch((err: Error) => cb(err))
    }
  )
)

// 序列化與反序列化
passport.serializeUser((user: any, cb) => cb(null, user.id))

passport.deserializeUser((id: number, cb) => {
  User.findByPk(id, { attributes: { exclude: ['password'] } })
    .then((user: UserData) => cb(null, user?.toJSON()))
    .catch((err: Error) => cb(err))
})

// 設定 JWT 策略
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
}

passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    try {
      cb(null, jwtPayload)
    } catch (err) {
      cb(err)
    }
  })
)

export default passport
