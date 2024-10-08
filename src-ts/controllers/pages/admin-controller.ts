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
  editStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.editStore(req, (err, data) => (err ? next(err) : res.render('admin/edit-store', data)))
  },
  putStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.putStore(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '變更成功!')
      res.redirect('/admin/stores')
    })
  },
  deleteStore: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.deleteStore(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '刪除成功!')
      res.redirect('back')
    })
  },
  addOwnership: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.addOwnership(req, (err, data) => {
      if (err) return next(err)
      return setTimeout(() => res.redirect('back'), 3000)
    })
  },
  removeOwnership: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.removeOwnership(req, (err, data) => {
      if (err) return next(err)
      return setTimeout(() => res.redirect('back'), 3000)
    })
  },
  getUsers: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getUsers(req, (err, data) => (err ? next(err) : res.render('admin/users', data)))
  },
  patchUser: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.patchUser(req, (err, data) => {
      if (err) return next(err)
      res.redirect('back')
    })
  },
  getOrders: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.getOrders(req, (err, data) => (err ? next(err) : res.render('admin/orders', data)))
  },
  deleteOrder: (req: Request, res: Response, next: NextFunction) => {
    return adminServices.deleteOrder(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('back')
    })
  }
}

export default adminController
