// 載入類型聲明文件
import { StoreServices } from '../typings/store-services'
import { StoreData, SizeData, SugarData, IceData } from '../typings/store-services'

// 引入資料表 model
const { Store, Drink, Size, Sugar, Ice } = require('../models')

// 載入所需的工具
import { getOffset, getPagination } from '../helpers/pagination-helpers'
import { Op, literal } from 'sequelize' // 引入 sequelize 查詢符、啟用 SQL 語法

const storeServices: StoreServices = {
  getStores: (req, cb) => {
    const DEFAULT_LIMIT = 12 // 預設每頁顯示幾筆資料
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)

    // 確保 keyword 是 string 然後進行 trim
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : ''
    return Store.findAndCountAll({
      raw: true,
      offset,
      limit,
      where: {
        // 展開運算子的優先級較低, 會比較慢判斷
        ...(keyword.length > 0
          ? {
              [Op.or]: [
                literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
                literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`)
              ]
            }
          : {})
      },

      nest: true,
      order: [['id', 'DESC']]
    })
      .then((stores: { rows: StoreData[]; count: number }) => {
        return cb(null, {
          stores: stores.rows,
          pagination: getPagination(limit, page, stores.count),
          isSearched: '/stores', // 決定搜尋表單發送位置為 index 頁面
          keyword,
          find: 'stores'
        })
      })
      .catch((err: Error) => cb(err))
  },
  getStore: (req, cb) => {
    const storeId = Number(req.params.id)
    // 確保 keyword 是 string 然後進行 trim
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : ''

    // 關聯 literal 的 model 依 include 填寫的 model
    const whereClause = {
      ...(keyword.length > 0
        ? {
            [Op.or]: [literal(`LOWER(ownedDrinks.name) LIKE '%${keyword.toLowerCase()}%'`)]
          }
        : {})
    }
    return Promise.all([
      Store.findByPk(storeId, {
        include: [
          {
            model: Drink,
            as: 'ownedDrinks',
            order: [['id', 'ASC']],
            where: whereClause,
            required: false // // 使用 LEFT OUTER JOIN，即使沒有關聯資料也會返回 store
          }
        ]
      }),
      // 撈出資料庫所有飲料, 讓個別店家勾選, 登陸進 ownerships
      Size.findAll({ raw: true }),
      Sugar.findAll({ raw: true }),
      Ice.findAll({ raw: true })
    ])
      .then(([storeOwnedDrinks, sizes, sugars, ices]: [StoreData, SizeData[], SugarData[], IceData[]]) => {
        if (!storeOwnedDrinks) throw Object.assign(new Error('該商店不存在!'), { status: 404 })

        const store = storeOwnedDrinks.toJSON()

        // 從店家販賣的飲料清單中, 拿取店家有販賣的飲料
        const drinksData = storeOwnedDrinks?.ownedDrinks?.map((od) => (od?.toJSON ? { ...od.toJSON() } : od)) || []

        return cb(null, {
          store,
          drinks: drinksData,
          sizes,
          sugars,
          ices,
          isSearched: `/stores/${req.params.id}`, // 決定搜尋表單發送位置
          keyword,
          find: 'drinks'
        })
      })
      .catch((err) => cb(err))
  }
}

export default storeServices
