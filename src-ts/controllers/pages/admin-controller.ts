// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import adminServices from '../../services/admin-services'

const adminController = {
  getStores: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getStores(req, (err, data) => (err ? next(err) : res.render('admin/stores', data)))
  },
  createStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  postStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  getStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  editStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  putStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  deleteStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  addOwnership: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  removeOwnership: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  getUsers: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  patchUser: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  getOrders: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  deleteOrder: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中')
}

export default adminController
