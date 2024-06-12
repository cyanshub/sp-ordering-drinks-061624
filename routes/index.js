const express = require('express')
const router = express.Router()

// 載入 controller 資料夾
const storeController = require('../controllers/store-controller')

// 載入 middleware
// 設計路由
router.get('/stores', storeController.getStores)
router.get('/', (req, res) => res.redirect('/stores'))

module.exports = router
