// 載入類型文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import storeServices from '../../services/store-services'

const storeController = {
  getStores: (req: Request, res: Response, next: NextFunction) => {
    storeServices.getStores(req, (err, data) => {
      if (err) return next(err)
      res.render('stores/stores', data)
    })
  },
  getStore: (req: Request, res: Response, next: NextFunction) => res.send('功能開發中')
}

export default storeController
