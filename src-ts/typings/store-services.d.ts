// 類型聲明文件

// 引入類型聲明
import { Request } from 'express'
import { PaginationResult } from '../helpers/pagination-helpers'

// 各個controller 方法的類型
interface Callback<T> {
  (err: Error | null, data?: T): void
}

export type StoreData = {
  id: number
  name: string
  address: string
  cover: string | null
  phone: string
  createdAt: date
  updatedAt: date
}

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

export interface GetStoresData {
  stores: StoreData[]
  pagination: PaginationResult
  isSearched: string
  keyword: string
  find: string
}

export interface StoreServices {
  getStores: (req: Request, cb: Callback<GetStoresData>) => void
}
