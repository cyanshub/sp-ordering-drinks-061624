// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 載入所需工具

const oauthController = {
  googleSignInPage: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中'),
  googleSignIn: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中')
}

export default oauthController
