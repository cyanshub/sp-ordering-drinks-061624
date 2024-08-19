// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入需要使用的工具
const express = require('express')
const handlebars = require('express-handlebars')

// 設定應用程式
const app = express()
const port = process.env.PORT || 3005

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Ordering drinks application listening on port: http://localhost:${port}`)
})
