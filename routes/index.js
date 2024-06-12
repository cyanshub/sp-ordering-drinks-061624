const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

// 載入 controller
const storeController = require('../controllers/store-controller')
const userController = require('../controllers/user-controller')

// 載入 middleware
const { generalErrorHandler } = require('../middlewares/error-handler')
const passport = require('../config/passport.js') // 使用者登入及識別
const { authenticated, authenticatedAdmin } = require('../middlewares/auth.js') // 負責驗證

// 設計路由
// 設計路由: 使用者相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 直接使用passport提供的方法進行登入驗證
router.get('/logout', userController.logOut)

// 設計路由: 前台區域
router.get('/stores', authenticated, storeController.getStores)

// 設計路由: 後台區域
router.use('/admin', authenticatedAdmin, admin)

router.get('/', (req, res) => res.redirect('/stores'))
router.use('/', generalErrorHandler)

module.exports = router
