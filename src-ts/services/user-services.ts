// 載入類型聲明
import { Request } from 'express'
import { UserServices, UserData } from '../typings/user-services'

// 載入所需 model
const { User } = require('../models')

// 載入所需工具
import bcrypt from 'bcryptjs'

const userServices: UserServices = {
  signUpPage: (req, cb) => {
    return cb(null)
  },
  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body
    const Salt = 10
    if (password !== passwordCheck) throw new Error('請再次確認密碼是否輸入正確')
    return User.findOne({ where: { email } })
      .then((user: UserData) => {
        if (user) throw new Error('使用者信箱已經存在')
        return bcrypt.hash(password, Salt)
      })
      .then((hash: string) => {
        return User.create({
          name,
          email,
          password: hash,
          isAdmin: false
        })
      })
      .then((newUser: UserData) => cb(null, { user: newUser }))
      .catch((err: Error) => cb(err))
  },
  signInPage: (req, cb) => {
    return cb(null)
  },
  signIn: (req, cb) => {
    // 實際的登入功能已經由 passport 以 middlewares 的形式處理
    return cb(null)
  },
  logOut: (req, cb) => {
    return cb(null)
  }
}

export default userServices
