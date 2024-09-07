// 載入類型聲明
import { Request } from 'express'
import { UserServices } from '../typings/user-services'
import { UserData, CartData, DrinkData, OrderData } from '../typings/user-services'

// 載入所需 model
const { User, Cart, Drink, Store, Size, Sugar, Ice, Order } = require('../models')

// 載入所需工具
import bcrypt from 'bcryptjs'
import { localAvatarHandler } from '../helpers/file-helpers'
import { UserAuth } from '../typings/express'
import { convertToTaiwanTime } from '../helpers/array-helpers'
import { getOffset, getPagination } from '../helpers/pagination-helpers'
import { Op, literal } from 'sequelize' // 引入 sequelize 查詢符、啟用 SQL 語法

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
  },
  removeCart: (req, cb) => {
    const cartId = Number(req.params.cartId)
    return Cart.findByPk(cartId)
      .then((cart: CartData) => {
        if (!cart) throw Object.assign(new Error('此購物車商品不存在!'), { status: 404 })
        return cart.destroy()
      })
      .then((deletedCart: CartData) => cb(null, { cart: deletedCart }))
      .catch((err: Error) => cb(err))
  },
  getOrders: (req, cb) => {
    const userAuth = req.user
    const DEFAULT_LIMIT = 5 // 預設每頁顯示幾筆資料
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字

    // 關聯 literal 的 model 依 include 填寫的 model
    const whereClause = {
      // find系列語法查詢條件
      userId: userAuth.id, // 只能查詢自己的訂單
      ...(keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(Drink.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`DATE_ADD(Order.created_at, INTERVAL 8 HOUR) LIKE '%${keyword}%'`)
            ]
          }
        : {})
    }

    return Order.findAndCountAll({
      raw: true,
      nest: true,
      where: whereClause,
      order: [['id', 'DESC']], // 依建立時間降續排列
      include: [
        // 避免密碼外洩
        { model: User, attributes: { exclude: ['password'] } },
        Drink,
        Store,
        Size,
        Sugar,
        Ice
      ],
      offset,
      limit
    })
      .then((orders: { rows: OrderData[]; count: number }) => {
        // 確保時間為台灣時區
        const ordersData = convertToTaiwanTime(orders.rows)

        return cb(null, {
          orders: ordersData,
          pagination: getPagination(limit, page, orders.count),
          isSearched: '/orders', // 決定搜尋表單發送位置
          keyword,
          find: 'orders',
          count: orders.count
        })
      })
      .catch((err: Error) => cb(err))
  }
}

export default userServices
