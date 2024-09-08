// 載入類型聲明
import { AdminServices } from '../typings/admin-services'
import { StoreData, DrinkData } from '../typings/store-services'
import { OwnershipData } from '../typings/admin-services'

// 載入所需 Model
const { Store, Drink, User, Ownership } = require('../models')

// 載入所需工具
import { getOffset, getPagination } from '../helpers/pagination-helpers'
import { Op, literal } from 'sequelize' // 引入 sequelize 查詢符、啟用 SQL 語法
import { localCoverHandler } from '../helpers/file-helpers'
import { UserData } from '../typings/user-services'

const adminServices: AdminServices = {
  // 店家相關
  getStores: (req, cb) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    // 確保 keyword 是 string 然後進行 trim
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '' // 取得並修剪關鍵字

    const whereClause = {
      // 展開運算子的優先級較低, 會比較慢判斷
      ...(keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`)
            ]
          }
        : {})
    }

    return Store.findAndCountAll({
      where: whereClause,
      raw: true,
      offset,
      limit,
      nest: true,
      order: [['id', 'DESC']]
    })
      .then((stores: { rows: StoreData[]; count: number }) => {
        const data = stores.rows
        return cb(null, {
          stores: data,
          pagination: getPagination(limit, page, stores.count),
          isSearched: '/admin/stores', // 決定搜尋表單發送位置為後台 index 頁面
          keyword,
          find: 'stores'
        })
      })
      .catch((err: Error) => cb(err))
  },
  createStore: (req, cb) => {
    return cb(null)
  },
  postStore: (req, cb) => {
    const { name, address, phone } = req.body
    const file = req.file // 根據之前修正的form content, 把檔案從req取出來

    // 檢驗必填欄位是否存在
    if (!name) throw Object.assign(new Error('店家名稱為必填欄位!'), { status: 422 })

    // 把取出的檔案 file 傳給 file-helper 處理
    return localCoverHandler(file)
      .then((filePath) => {
        return Store.create({
          name,
          address,
          phone,
          cover: filePath || null
        })
      })
      .then((newStore) => cb(null, { store: newStore }))
      .catch((err: Error) => cb(err))
  },
  getStore: (req, cb) => {
    // 確保 keyword 是 string 然後進行 trim
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '' // 取得並修剪關鍵字
    // 關聯 literal 的 model 依 include 填寫的 model
    const whereClause = {
      ...(keyword.length > 0
        ? {
            [Op.or]: [literal(`LOWER(Drink.name) LIKE '%${keyword.toLowerCase()}%'`)]
          }
        : {})
    }
    return Promise.all([
      Store.findByPk(Number(req.params.id), {
        include: [
          {
            model: Drink,
            as: 'ownedDrinks',
            order: [['id', 'ASC']]
          }
        ]
      }),
      // 撈出資料庫所有飲料, 讓個別店家勾選, 登陸進 ownerships
      Drink.findAll({
        raw: true,
        where: whereClause
      })
    ])
      .then(([store, drinks]: [StoreData, DrinkData[]]) => {
        if (!store) throw Object.assign(new Error('該商店不存在!'), { status: 404 })
        // 取出店家有販賣的 drink id 當作販賣清單
        const ownedDrinksId = store.ownedDrinks ? store.ownedDrinks.map((od) => od.id) : []

        // 將所有飲料逐一比對販賣清單中的飲料, 並將有無結果用isOwned變數儲存
        const drinksData = drinks.map((d) => ({
          ...d,
          isOwned: ownedDrinksId.includes(d.id)
        }))

        store = store.toJSON()
        return cb(null, {
          store,
          drinks: drinksData,
          isSearched: `/admin/stores/${req.params.id}`,
          keyword: keyword,
          find: 'drinks'
        })
      })
      .catch((err: Error) => cb(err))
  },
  editStore: (req, cb) => {
    return Store.findByPk(req.params.id, { raw: true })
      .then((store: StoreData) => {
        if (!store) throw Object.assign(new Error('該店家不存在!'), { status: 404 })
        return cb(null, { store })
      })
      .catch((err: Error) => cb(err))
  },
  putStore: (req, cb) => {
    const storeId = Number(req.params.id)
    const { name, address, phone } = req.body
    if (!name) {
      // 檢驗必填欄位是否存在
      throw Object.assign(new Error('案場名稱為必填欄位!'), { status: 422 })
    }
    const file = req.file // 拿到 middleware: multer 上傳的圖片
    // 使用 Promise.all 語法, 待所有非同步事件處理完才跳入下一個.then()
    // Promise.all([非同步A, 非同步B]).then(([A結果, B結果]) => {...})
    return Promise.all([Store.findByPk(storeId), localCoverHandler(file)])
      .then(([store, filePath]: [StoreData, string | null]) => {
        if (!store) throw Object.assign(new Error('該案場不存在!'), { status: 404 })
        return store.update({
          name,
          address,
          phone,
          cover: filePath || store.cover
        })
      })
      .then((editedStore: StoreData) => cb(null, { store: editedStore }))
      .catch((err: Error) => cb(err))
  },
  deleteStore: (req, cb) => {
    return Store.findByPk(Number(req.params.id))
      .then((store: StoreData) => {
        if (!store) throw Object.assign(new Error('該案場不存在!'), { status: 404 })
        return store.destroy()
      })
      .then((deletedStore: StoreData) => cb(null, { store: deletedStore }))
      .catch((err: Error) => cb(err))
  },

  // 使用者相關
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true,
      attributes: { exclude: ['password'] }
    })
      .then((users: UserData[]) => cb(null, { users }))
      .catch((err: Error) => cb(err))
  },
  patchUser: (req, cb) => {
    return User.findByPk(Number(req.params.id), {
      // 避免密碼資料外洩
      attributes: { exclude: ['password'] }
    })
      .then((user: UserData) => {
        // 檢查使用者是否存在
        if (!user) throw Object.assign(new Error('使用者不存在!'), { status: 404 })
        if (user.email === 'root@example.com') {
          throw Object.assign(new Error('禁止變更 root 使用者權限!'), { status: 403 })
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then((editedUser: UserData) => cb(null, { user: editedUser }))
      .catch((err: Error) => cb(err))
  },
  addOwnership: (req, cb) => {
    const storeId = Number(req.body.storeId) // 從隱藏input拿取店家 id
    const drinkId = Number(req.params.drinkId) // 從路由拿取商品 id
    return Promise.all([Drink.findByPk(drinkId), Ownership.findOne({ where: { storeId, drinkId } })])
      .then(([drink, ownership]: [DrinkData, OwnershipData]) => {
        if (!drink) throw Object.assign(new Error('該商品不存在!'), { status: 404 })
        if (ownership) throw Object.assign(new Error('商品已在販賣清單!'), { status: 409 })
        return Ownership.create({ storeId, drinkId })
      })
      .then((newOwnership: OwnershipData) => cb(null, { ownership: newOwnership }))
      .catch((err: Error) => cb(err))
  }
}

export default adminServices
