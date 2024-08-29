import express from 'express'
const router = express.Router()
import admin from './modules/admin'

// 載入 controller
import storeController from '../../controllers/pages/store-controller'

// 載入 middleware
import { generalErrorHandler } from '../../middlewares/error-handler'

// 設計路由
// 設計路由: 使用者登入相關

// 設計路由: OAuth2 登入相關

// 設計路由: 使用者相關

// 設計路由: 前台區域
router.get('/stores', storeController.getStores)

// 設計路由: 後台區域
router.use('/admin', admin)

// 設計路由: 錯誤相關
router.use('/', (req, res) => res.redirect('/stores'))
router.use('/', generalErrorHandler)

export default router
