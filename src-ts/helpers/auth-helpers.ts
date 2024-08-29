// 載入類型聲明文件
import { UserData } from '../typings/user-services'

import { Request } from 'express'

const getUser = (req: Request) => {
  return (req.user as UserData) || null
}

const ensureAuthenticated = (req: Request): boolean => {
  return req.isAuthenticated()
}

export { getUser, ensureAuthenticated }
