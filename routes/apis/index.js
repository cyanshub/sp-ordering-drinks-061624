const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

// 載入 controller
const storeController = require('../../controllers/apis/store-controller')
const userController = require('../../controllers/apis/user-controller')

// 載入 middleware
const { apiErrorHandler } = require('../../middlewares/error-handler.js')
const passport = require('../../config/passport.js') // 使用者登入及識別
const { authenticated, authenticatedAdmin } = require('../../middlewares/api-auth.js') // 負責驗證
const upload = require('../../middlewares/multer.js') // 負責圖片上傳功能

// 設計路由
// 設計路由: 使用者登入相關
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 直接使用passport提供的方法進行登入驗證

// 設計路由: 使用者相關
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser)
router.put('/avatars/:userId', authenticated, userController.putAvatar)
router.get('/carts', authenticated, userController.getCarts)
router.post('/carts/:storeId', authenticated, userController.addCart)
router.delete('/carts/:cartId', authenticated, userController.removeCart)
router.get('/orders', authenticated, userController.getOrders)
router.post('/orders/all', authenticated, userController.addOrders)

// 設計路由: 前台區域
router.get('/stores', authenticated, storeController.getStores)
router.get('/stores/:id', authenticated, storeController.getStore)

// 設計路由: 後台區域
router.use('/admin', authenticated, authenticatedAdmin, admin)

// 設計路由: 錯誤相關
router.use('/', apiErrorHandler)

module.exports = router
