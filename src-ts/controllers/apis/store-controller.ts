// 載入類型聲明文件
import { Request, Response, NextFunction } from 'express'

// 抽取 services 層
import storeServices from '../../services/store-services'

const storeController = {
  getStores: (req: Request, res: Response, next: NextFunction) => {
    storeServices.getStores(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  },
  getStore: (req: Request, res: Response, next: NextFunction) => {
    storeServices.getStore(req, (err, data) => (err ? next(err) : res.json({ status: 200, data })))
  }
}

export default storeController
