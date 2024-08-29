import { Request, Response, NextFunction } from 'express'
import { getUser, ensureAuthenticated } from '../helpers/auth-helpers'

const authenticated = (req: Request, res: Response, next: NextFunction): void => {
  // 確保使用者經過登入驗證
  if (ensureAuthenticated(req)) {
    return next()
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // 確保使用者經過登入驗證
  if (ensureAuthenticated(req)) {
    const user = getUser(req)
    // 確保使用者的 isAdmin 為 true
    if (user && user.isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

export { authenticated, authenticatedAdmin }
