// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 載入所需工具
import passport from '../../config/passport'

// 定義 oauth 第三方登入的類型聲明
interface PassportUser {
  id: number
  email: string
}

const oauthController = {
  googleSignInPage: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
  },
  googleSignIn: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err: Error, user: PassportUser, info: any) => {
      if (err) {
        console.error('Error authenticating with Google:', err)
        return res.status(500).send('Error authenticating with Google')
      }
      if (!user) {
        req.flash('error_messages', '登入失敗，請再試一次')
        return res.redirect('/signin')
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error logging in user:', err)
          return res.status(500).send('Error logging in user')
        }
        req.flash('success_messages', '登入成功!')
        return res.redirect('/stores')
      })
    })(req, res, next)
  }
}

export default oauthController
