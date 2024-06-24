// 引入資料表 model
const { Store, Drink, Size, Sugar, Ice } = require('../models')

// 載入所需的工具
const { getOffset, getPagination } = require('../helpers/pagination-helpers.js')
const { Op, literal } = require('sequelize') // 引入 sequelize 查詢符、啟用 SQL 語法

const storeController = {
  getStores: (req, res, next) => {
    const DEFAULT_LIMIT = 12 // 預設每頁顯示幾筆資料
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字
    return Store.findAndCountAll({
      raw: true,
      offset,
      limit,
      where: {
        // 展開運算子的優先級較低, 會比較慢判斷
        ...keyword.length > 0
          ? {
              [Op.or]: [
                literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
                literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`)
              ]
            }
          : {}
      },

      nest: true,
      order: [['id', 'DESC']]
    })
      .then(stores => {
        const data = stores.rows
        return res.render('stores', {
          stores: data,
          pagination: getPagination(limit, page, stores.count),
          isSearched: '/stores', // 決定搜尋表單發送位置為 index 頁面
          keyword,
          find: 'stores'
        })
      })
      .catch(err => next(err))
  },
  getStore: (req, res, next) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字
    // 關聯 literal 的 model 依 include 填寫的 model
    const whereClause = {
      ...keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(ownedDrinks.name) LIKE '%${keyword.toLowerCase()}%'`)
            ]
          }
        : {}
    }
    return Promise.all([
      Store.findByPk(req.params.id, { raw: true }),
      Store.findByPk(req.params.id, {
        include: [{
          model: Drink,
          as: 'ownedDrinks',
          order: [['id', 'ASC']],
          where: whereClause
        }]
      }),
      // 撈出資料庫所有飲料, 讓個別店家勾選, 登陸進 ownerships
      Size.findAll({ raw: true }),
      Sugar.findAll({ raw: true }),
      Ice.findAll({ raw: true })
    ])

      .then(([store, storeOwnedDrinks, sizes, sugars, ices]) => {
        if (!store) throw new Error('該商店不存在!')

        // 從店家販賣的飲料清單中, 拿取店家有販賣的飲料
        const drinksData = storeOwnedDrinks?.ownedDrinks?.map(od => ({ ...od.toJSON() })) || []

        storeOwnedDrinks = storeOwnedDrinks?.toJSON() || storeOwnedDrinks

        return res.render('store', {
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
      .catch(err => next(err))
  }
}

module.exports = storeController
