// 類型聲明文件

// 引入類型聲明
import { Request } from 'express'
import { PaginationResult } from '../helpers/pagination-helpers'
import { Model } from 'sequelize'

// 各個controller 方法的類型
interface Callback<T> {
  (err: Error | null, data?: T): void
}

// 繼承 sequelize 物件方法
// 資料表類型(若注意有無關聯資料, 記得增添為可選)
export interface StoreData extends Model {
  id: number
  name: string
  address: string
  cover: string | null
  phone: string
  createdAt: date
  updatedAt: date
  ownedDrinks?: DrinkData[]
}

export interface DrinkData extends Model {
  id: number
  name: string
  priceM: number
  priceL: number
  createdAt: Date
  updatedAt: Date
}

export type SizeData = {
  id: number
  level: string
  createdAt: Date
  updatedAt: Date
}
export type SugarData = SizeData
export type IceData = SizeData

// helpers 工具類型
export interface PaginationResult {
  pages: number[]
  totalPage: number
  currentPage: number
  prev: number
  next: number
  initialPages: number[]
  visiblePages: number[]
  finalPages: number[]
  hasPrevEllipsis: boolean
  hasNextEllipsis: boolean
}

// controller 的 callback 傳遞的資料型別
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
  sizes: SizeData[]
  sugars: SugarData[]
  ices: IceData[]
  isSearched: string
  keyword: string
  find: string
}

export interface StoreServices {
  getStores: (req: Request, cb: Callback<GetStoresData>) => void
  getStore: (req: Request, cb: Callback<GetStoreData>) => void
}
