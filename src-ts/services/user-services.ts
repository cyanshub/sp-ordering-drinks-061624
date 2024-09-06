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
  },
  getUser: (req, cb) => {
    const userId = Number(req.params.id)
    return User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })
      .then((user: UserData) => {
        if (!user) throw Object.assign(new Error('使用者不存在!'), { status: 404 })
        user = user.toJSON() // 整理 user 資料
        return cb(null, { user })
      })
      .catch((err: Error) => cb(err))
  },
  editUser: (req, cb) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw Object.assign(new Error('只能編輯自己的使用者資料!'), { status: 403 })
    return User.findByPk(Number(req.params.id), {
      attributes: { exclude: ['password'] },
      raw: true
    })
      .then((user:UserData) => {
        if (!user) throw Object.assign(new Error('使用者不存在!'), { status: 404 })
        return cb(null, { user })
      })
      .catch((err:Error) => cb(err))
  }
}

export default userServices
