// 類型聲明文件

// 引入其他類型聲明文件
import { Request } from 'express'
import { Model } from 'sequelize'

// 資料表類型 (注意若有關聯資料, 記得增添為可選)
import { DrinkData, StoreData } from './store-services'
import { OrderData, UserData } from './user-services'
export interface OwnershipData extends Partial<Model> {
  id: number
  storeId: number
  drinkId: number
  createdAt: date
  updatedAt: date
}

// helpers 工具類型
import { PaginationResult } from './store-services'

// 假設有 req.body
export interface PostStoreBody {
  name: string
  address: string
  phone: string
}

export interface PutStoreBody {
  name: string
  address: string
  phone: string
}

// controller 的 callback 傳遞的資料型別
// getStores 回傳的資料
export interface GetStoresData {
  stores: StoreData[]
  pagination: PaginationResult
  isSearched: string
  keyword: string
  find: string
}

export interface GetStoreData {
  store: StoreData
  drinks: DrinkData[]
  isSearched: string
  keyword: string
  find: string
}

export interface GetOrdersData {
  orders: orderData
  pagination: PaginationResult
  isSearched: string
  keyword: string
  find: string
  count: number
}

interface Callback<T> {
  (err: Error | null, data?: T): void
}

// Request<{},{},{},{}> 4個參數分別代表 Params, ResBody, ReqBody, ReqQuery 型別
export interface AdminServices {
  getStores: (req: Request, cb: Callback<GetStoresData>) => void
  createStore: (req: Request, cb: Callback<void>) => void
  postStore: (req: Request<{}, {}, PostStoreBody, {}>, cb: Callback<{ store: StoreData }>) => void
  getStore: (req: Request, cb: Callback<GetStoreData>) => void
  editStore: (req: Request, cb: Callback<{ store: StoreData }>) => void
  putStore: (req: Request<{ id?: number }, {}, PutStoreBody, {}>, cb: Callback<{ store: StoreData }>) => void
  deleteStore: (req: Request, cb: Callback<{ store: StoreData }>) => void
  getUsers: (req: Request, cb: Callback<{ users: UserData[] }>) => void
  patchUser: (req: Request, cb: Callback<{ user: UserData }>) => void
  addOwnership: (req: Request, cb: Callback<{ ownership: OwnershipData }>) => void
  removeOwnership: (req: Request, cb: Callback<{ ownership: OwnershipData }>) => void
  getOrders: (req: Request, cb: Callback<GetOrdersData>) => void
  deleteOrder: (req: Request, cb: Callback<{ order: OrderData }>) => void
}
