// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import adminServices from '../../services/admin-services'

const adminController = {
  getStores: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getStores(req, (err, data) => (err ? next(err) : res.render('admin/stores', data)))
  },
  createStore: (req: Request, res: Response, next: NextFunction) => {
    return res.render('admin/create-store')
  },
  postStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.postStore(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功新增店家!')
      res.redirect('/admin/stores')
    })
  },
  getStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getStore(req, (err, data) => (err ? next(err) : res.render('admin/store', data)))
  },
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
