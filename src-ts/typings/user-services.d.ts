// 類型聲明文件

import { Model } from 'sequelize'

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
}
