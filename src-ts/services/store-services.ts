// 載入類型聲明文件
import { StoreServices, StoreData } from '../typings/store-services'

// 引入資料表 model
const { Store } = require('../models')

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
  }
}

export default storeServices
