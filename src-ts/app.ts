// 載入需要使用的工具
import express from 'express'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// 設定應用程式
const app = express()
const port = process.env.PORT || 3005

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.send('首頁')
})

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Ordering drinks application listening on port: http://localhost:${port}`)
})
