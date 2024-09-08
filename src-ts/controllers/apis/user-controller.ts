// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import userServices from '../../services/user-services'

// 載入所需的工具
import jwt from 'jsonwebtoken'

const userController = {
  signUp: (req: Request, res: Response, next: NextFunction) => {
    return userServices.signUp(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  signIn: (req: Request, res: Response, next: NextFunction) => {
    // 利用 try catch 處理不是非同步語法的錯誤事件
    try {
      // 因為關閉了session功能, 因此要自己整理 user 的 sequelize 打包物件
      // 檢查 req.user 是否存在
      if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'User not authenticated' })
      }

      // 確保 user 可以調用 toJSON 方法
      const userData = req.user.toJSON ? req.user.toJSON() : req.user

      // 不應該拿 user 的 password, 可使用 delete 方法把敏感資料拿掉
      delete userData.password

      // 利用 jwt 來發 token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 200,
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getUser(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  editUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.editUser(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  putUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.putUser(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  putAvatar: (req: Request, res: Response, next: NextFunction) => {
    return userServices.putAvatar(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  getCarts: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getCarts(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  addCart: (req: Request, res: Response, next: NextFunction) => {
    return userServices.addCart(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  removeCart: (req: Request, res: Response, next: NextFunction) => {
    return userServices.removeCart(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  getOrders: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getOrders(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  addOrders: (req: Request, res: Response, next: NextFunction) => {
    return userServices.addOrders(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  }
}

export default userController
