// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 載入工具
import passport from '../config/passport'
import { UserData } from '../typings/user-services'

const authenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: UserData) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user // 被cb覆蓋掉了 記得寫回來 否則登入不會有req.user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

export { authenticated, authenticatedAdmin }
