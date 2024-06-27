const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

// 載入 controller
const storeController = require('../../controllers/pages/store-controller')
const userController = require('../../controllers/pages/user-controller')

// 載入 middleware
const { generalErrorHandler } = require('../../middlewares/error-handler.js')
const passport = require('../../config/passport.js') // 使用者登入及識別
const { authenticated, authenticatedAdmin } = require('../../middlewares/auth.js') // 負責驗證
const upload = require('../../middlewares/multer.js') // 負責圖片上傳功能

// 設計路由
// 設計路由: 使用者相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 直接使用passport提供的方法進行登入驗證
router.get('/logout', userController.logOut)
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
router.use('/admin', authenticatedAdmin, admin)

router.get('/', (req, res) => res.redirect('/stores'))
router.use('/', generalErrorHandler)

module.exports = router
