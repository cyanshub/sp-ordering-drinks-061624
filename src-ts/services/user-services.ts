// 載入類型聲明
import { Request } from 'express'
import { UserServices, UserData, CartData, DrinkData } from '../typings/user-services'

// 載入所需 model
const { User, Cart, Drink, Store, Size, Sugar, Ice } = require('../models')

// 載入所需工具
import bcrypt from 'bcryptjs'
import { localAvatarHandler } from '../helpers/file-helpers'
import { UserAuth } from '../typings/express'
import { convertToTaiwanTime } from '../helpers/array-helpers'

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
      .then((user: UserData) => {
        if (!user) throw Object.assign(new Error('使用者不存在!'), { status: 404 })
        return cb(null, { user })
      })
      .catch((err: Error) => cb(err))
  },
  putUser: (req: Request & { body: { name: string }; file?: Express.Multer.File }, cb) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    const userAuth = req.user as UserAuth // 利用 as 類型斷言明確告訴 TS req.user 的型別是 UserDate
    if (Number(req.params.id) !== userAuth?.id) throw Object.assign(new Error('只能編輯自己的使用者資料!'), { status: 403 })

    const { name } = req.body

    if (!name.trim()) throw Object.assign(new Error('需要輸入使用者名稱!'), { status: 422 })

    const file = req.file // 根據之前修正的form content, 把檔案從req取出來
    return Promise.all([
      User.findByPk(Number(req.params.id), {
        attributes: { exclude: ['password'] }
      }),
      localAvatarHandler(file) // 將圖案寫入指定資料夾, 並回傳圖檔路徑
    ])
      .then(([user, filePath]: [UserData, string | null]) => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          avatar: filePath || user.avatar
        })
      })
      .then((updatedUser) => cb(null, { user: updatedUser }))
      .catch((err: Error) => cb(err))
  },
  putAvatar: (req, cb) => {
    const userId = Number(req.params.userId)
    return User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })
      .then((user: UserData) => {
        if (!user) throw Object.assign(new Error('使用者不存在!'), { status: 404 })
        return user.update({ avatar: null })
      })
      .then((updatedUser: UserData) => cb(null, { user: updatedUser }))
      .catch((err: Error) => cb(err))
  },
  getCarts: (req, cb) => {
    const userAuth = req.user as UserAuth // 利用 as 類型斷言明確告訴 TS req.user 的型別是 UserDate
    return Cart.findAll({
      raw: true,
      nest: true,
      where: { userId: userAuth.id },
      include: [
        // 避免密碼外洩
        { model: User, attributes: { exclude: ['password'] } },
        Drink,
        Store,
        Size,
        Sugar,
        Ice
      ]
    })
      .then((carts: CartData[]) => {
        if (!carts) throw Object.assign(new Error('購物車不存在'), { status: 404 })
        // 確保時間為台灣時區
        const data = convertToTaiwanTime(carts)
        return cb(null, { carts: data })
      })
      .catch((err: Error) => cb(err))
  },
  addCart: (req, cb) => {
    const userId = req.user.id
    const drinkId = Number(req.body.drinkId)
    const sizeId = Number(req.body.sizeId)
    const sugarId = Number(req.body.sugarId)
    const iceId = Number(req.body.iceId)
    const amount = Number(req.body.amount)

    if (!sizeId) throw Object.assign(new Error('請選擇中杯或大杯'), { status: 422 })
    if (!sugarId) throw Object.assign(new Error('請選擇甜度'), { status: 422 })
    if (!iceId) throw Object.assign(new Error('請選擇冰量!'), { status: 422 })
    if (!amount) throw Object.assign(new Error('請選擇購買杯數!'), { status: 422 })

    const storeId = Number(req.params.storeId)
    if (!storeId) throw Object.assign(new Error('店家不存在!'), { status: 404 })
    return Drink.findByPk(drinkId)
      .then((drink: DrinkData) => {
        if (!drink) throw Object.assign(new Error('該商品不存在!'), { status: 404 })
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
      .then((newCart: CartData) => cb(null, { cart: newCart }))
      .catch((err: Error) => cb(err))
  }
}

export default userServices
