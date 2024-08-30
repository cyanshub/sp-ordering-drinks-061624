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
  getUser: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  editUser: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  putUser: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  putAvatar: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  getCarts: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  addCart: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  removeCart: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  getOrders: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  addOrders: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中')
}

export default userController