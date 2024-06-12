const express = require('express')
const router = express.Router()

router.get('/stores', (req, res) => {
  res.send('功能開發中!')
})

// 設計路由: 導向後臺首頁
router.use('/', (req, res) => res.redirect('/admin/stores'))

module.exports = router
