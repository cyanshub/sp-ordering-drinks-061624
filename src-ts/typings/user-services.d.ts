// 類型聲明文件

import { Model } from 'sequelize'

// 引入類型聲明
import { PaginationResult } from '../helpers/pagination-helpers'

// 繼承 sequelize 物件方法
export interface UserData extends Model {
  id: number
  name: string
  email: string
  password: string
  isAdmin: boolean | null
  avatar: string | null
  createdAt: date
  updatedAt: date
}

export interface CartData extends Model {
  id: number
  amount: number
  userId: number
  drinkId: number
  sizeId: number
  sugarId: number
  iceId: number
  storeId: number
  createdAt: date
  updatedAt: date
}

// 注意若有關聯資料, 記得增添為可選)
export interface OrderData extends CartData {
  Size?: { level?: string }
  Ice?: { level?: string }
  Sugar?: { level?: string }
  Drink?: { name?: string }
}

export interface DrinkData extends Model {
  id: number
  name: string
  createdAt: date
  updatedAt: date
  priceM: number
  priceL: number
}

// helpers 回傳值類型
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

interface Callback<T> {
  (err: Error | null, data?: T): void
}

// 假設有 req.body
export interface SignUpBody {
  name: string
  email: string
  password: string
  passwordCheck: string
}

// controller 的 callback 傳遞的資料型別
export interface GetOrdersData {
  orders: OrderData[]
  pagination: PaginationResult
  isSearched: string
  keyword: string
  find: string
  count: number
}

export interface UserServices {
  signUpPage: (req: Request, cb: Callback<void>) => void

  // Request<{},{},{},{}> 4個參數分別代表 Params 型別, ResBody, ReqBody, ReqQuery
  // cb: Callback<{ user: UserData }> 相等於  cb: (error: Error | null, { user: UserData }?: { user: UserData }) => void
  signUp: (req: Request<{}, {}, SignUpBody>, cb: Callback<{ user: UserData }>) => void

  signInPage: (req: Request, cb: Callback<void>) => void
  signIn: (req: Request, cb: Callback<void>) => void
  logOut: (req: Request, cb: Callback<void>) => void

  // 在第一個參數擴展 req params 類型，指定 id 屬性為 string
  getUser: (req: Request<{ id: number }>, cb: Callback<{ user: UserData }>) => void
  editUser: (req: Request<{ id: number }>, cb: Callback<{ user: UserData }>) => void
  putUser: (req: Request<{ id: number }, {}, { name: string }>, cb: Callback<{ user: UserData }>) => void
  putAvatar: (req: Request<{ id: number }>, cb: Callback<{ user: UserData }>) => void
  getCarts: (req: Request<>, cb: Callback<{ carts: CartData[] }>) => void
  addCart: (req: Request<>, cb: Callback<{ cart: CartData }>) => void
  removeCart: (req: Request<{ cartId: number }>, cb: Callback<{ cart: CartData }>) => void

  getOrders: (req: Request<>, cb: Callback<GetOrdersData>) => void
  addOrders: (req: Request<>, cb: Callback<{ orders: OrderData[] }>) => void
}
