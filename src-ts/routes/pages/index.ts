import express from 'express'
const router = express.Router()
import admin from './modules/admin'

// 載入 controller

// 載入 middleware

// 設計路由
router.get('/', (req, res) => {
  res.send('首頁: 功能開發中!')
})

// 設計路由: 使用者登入相關

// 設計路由: OAuth2 登入相關

// 設計路由: 使用者相關

// 設計路由: 前台區域

// 設計路由: 後台區域
router.use('/admin', admin)

export default router
