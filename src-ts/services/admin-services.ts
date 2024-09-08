// 載入類型聲明
import { AdminServices } from '../typings/admin-services'
import { StoreData } from '../typings/store-services'

// 載入所需 Model
const { Store } = require('../models')

// 載入所需工具
import { getOffset, getPagination } from '../helpers/pagination-helpers'
import { Op, literal } from 'sequelize' // 引入 sequelize 查詢符、啟用 SQL 語法

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
  }
}

export default adminServices
