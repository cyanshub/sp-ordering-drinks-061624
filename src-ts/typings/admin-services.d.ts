// 類型聲明文件

// 引入其他類型聲明文件
import { Request } from 'express'
import { Model } from 'sequelize'

// 資料表類型 (注意若有關聯資料, 記得增添為可選)
import { StoreData } from './store-services'

// helpers 工具類型
import { PaginationResult } from './store-services'

// 假設有 req.body

// controller 的 callback 傳遞的資料型別
// getStores 回傳的資料
export interface GetStoresData {
  stores: StoreData[]
  pagination: PaginationResult
  isSearched: string
  keyword: string
  find: string
}

interface Callback<T> {
  (err: Error | null, data?: T): void
}

// Request<{},{},{},{}> 4個參數分別代表 Params, ResBody, ReqBody, ReqQuery 型別
export interface AdminServices {
  getStores: (req: Request, cb: Callback<GetStoresData>) => void
  createStore: (req: Request, cb: Callback<void>) => void
}
