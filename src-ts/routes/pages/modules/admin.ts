import express from 'express'
const router = express.Router()

// 載入 middlewawre
import upload from '../../../middlewares/multer'

// 載入 controller
import adminController from '../../../controllers/pages/admin-controller'

// 設計路由
// 設計路由: 場域相關
router.get('/stores', adminController.getStores)
router.get('/stores/create', adminController.createStore)
router.post('/stores', upload.single('cover'), adminController.postStore)
router.get('/stores/:id', adminController.getStore)
router.get('/stores/:id/edit', adminController.editStore)
router.put('/stores/:id', upload.single('cover'), adminController.putStore)
router.delete('/stores/:id', adminController.deleteStore)

// 設計路由: 飲料販賣相關
router.post('/ownership/:drinkId', adminController.addOwnership)
router.delete('/ownership/:drinkId', adminController.removeOwnership)

// 設計路由: 使用者相關
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

// 設記路由: 訂單相關
router.get('/orders', adminController.getOrders)
router.delete('/orders/:orderId', adminController.deleteOrder)

// 設計路由: 導向後臺首頁
router.use('/', (req, res) => res.redirect('/admin/stores'))

export default router
