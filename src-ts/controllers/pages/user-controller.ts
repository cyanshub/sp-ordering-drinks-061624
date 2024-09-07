// 載入類型文件
import { Request, Response, NextFunction } from 'express'
import { SignUpBody } from '../../typings/user-services'

// 抽取 services 層
import userServices from '../../services/user-services'

const userController = {
  signUpPage: (req: Request, res: Response, next: NextFunction) => {
    return res.render('users/signup')
  },
  signUp: (req: Request & { body: SignUpBody }, res: Response, next: NextFunction) => {
    return userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號!')
      return res.redirect('/signin')
    })
  },
  signInPage: (req: Request, res: Response, next: NextFunction) => {
    return res.render('users/signin')
  },
  signIn: (req: Request, res: Response, next: NextFunction) => {
    // 實際的登入功能已經由 passport 以 middlewares 的形式處理
    req.flash('success_messages', '登入成功!')
    return res.redirect('/stores')
  },
  logOut: (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.flash('success_messages', '登出成功!')
      return res.redirect('/signin')
    })
  },
  getUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getUser(req, (err, data) => (err ? next(err) : res.render('users/profile', data)))
  },
  editUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.editUser(req, (err, data) => (err ? next(err) : res.render('users/edit-user', data)))
  },
  putUser: (req: Request, res: Response, next: NextFunction) => {
    return userServices.putUser(req, (err, data) => {
      if (err) {
        return next(err)
      }
      console.log('測試:', data)
      req.flash('success_messages', '已變更成功!')
      return res.redirect(`/users/${data?.user.id}`)
    })
  },
  putAvatar: (req: Request, res: Response, next: NextFunction) => {
    return userServices.putAvatar(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功移除頭像!')
      return res.redirect('back')
    })
  },
  getCarts: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getCarts(req, (err, data) => (err ? next(err) : res.render('users/carts', data)))
  },
  addCart: (req: Request, res: Response, next: NextFunction) => {
    return userServices.addCart(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '商品已成功加入購物車!')
      return res.redirect('/carts')
    })
  },
  removeCart: (req: Request, res: Response, next: NextFunction) => {
    return userServices.removeCart(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功退回訂單')
      return res.redirect(`/stores/${data?.cart.storeId}`)
    })
  },
  getOrders: (req: Request, res: Response, next: NextFunction) => {
    return userServices.getOrders(req, (err, data) => (err ? next(err) : res.render('users/orders', data)))
  },
  addOrders: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中')
}

export default userController
