const express = require('express')
const router = express.Router()

// 載入所需工具
const googleOAuth2Client = require('../../config/googleOAuth2Client')

// 設計路由
router.get('/google/callback', async (req, res) => {
  const code = req.query.code
  try {
    // 通過登入導向 authUrl
    // 連到 auth/google/callback, 取得服務 tokens
    const { tokens } = await googleOAuth2Client.getToken(code)
    googleOAuth2Client.setCredentials(tokens)
    req.session.tokens = tokens

    // 拿到 tokens 後再進行登入!
    req.flash('success_messages', '登入成功!')
    return res.redirect('/stores')
  } catch (err) {
    console.error('Error authenticating with Google:', err)
    res.status(500).send('Error authenticating with Google')
  }
})

module.exports = router
