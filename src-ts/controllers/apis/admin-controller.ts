// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import adminServices from '../../services/admin-services'

const adminController = {
  getStores: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getStores(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },

  postStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.postStore(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  getStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getStore(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  putStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.putStore(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  deleteStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.deleteStore(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  addOwnership: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.addOwnership(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  removeOwnership: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.removeOwnership(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  getUsers: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getUsers(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  patchUser: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.patchUser(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  getOrders: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getOrders(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  deleteOrder: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.deleteOrder(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  }
}

export default adminController
