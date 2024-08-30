import express from 'express'
const router = express.Router()

// 載入 controller
import oauthController from '../../../controllers/pages/oauth-controller'

// 設計路由: OAuth2 登入相關
router.get('/auth/google', oauthController.googleSignInPage) // Google 登入
router.get('/auth/google/callback', oauthController.googleSignIn) // Google 驗證回調

export default router
