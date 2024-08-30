import express from 'express'
const router = express.Router()
import admin from './modules/admin'
import oauth from './modules/oauth'

// 載入 controller
import storeController from '../../controllers/pages/store-controller'
import userController from '../../controllers/pages/user-controller'

// 載入 middleware
import passport from '../../config/passport'
import { authenticated, authenticatedAdmin } from '../../middlewares/auth'
import { generalErrorHandler } from '../../middlewares/error-handler'

// 設計路由
// 設計路由: 使用者登入相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 直接使用passport提供的方法進行登入驗證
router.get('/logout', userController.logOut)

// 設計路由: 使用者相關
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, userController.putUser) // 預期開發上傳圖片的 middleware
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

// 設計路由: OAuth2 登入相關
router.use('/', oauth)

// 設計路由: 錯誤相關
router.use('/', (req, res) => res.redirect('/stores'))
router.use('/', generalErrorHandler)

export default router
