// 載入類型聲明
import { AdminServices } from '../typings/admin-services'
import { StoreData, DrinkData } from '../typings/store-services'

// 載入所需 Model
const { Store, Drink } = require('../models')

// 載入所需工具
import { getOffset, getPagination } from '../helpers/pagination-helpers'
import { Op, literal } from 'sequelize' // 引入 sequelize 查詢符、啟用 SQL 語法
import { localCoverHandler } from '../helpers/file-helpers'

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
  }
}

export default adminServices
