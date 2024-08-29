// 載入需要使用的工具
import express from 'express'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'
import path from 'path'
import methodOverride from 'method-override'
import handlebarsHelpers from './helpers/handlebars-helpers'
import { pages, apis } from './routes'

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// 設定應用程式
const app = express()
const port = process.env.PORT || 3005


// 設定樣板引擎
app.engine('hbs', handlebars({ 
  extname: '.hbs', 
  helpers: handlebarsHelpers
}))

// 使用樣版引擎
app.set('view engine', 'hbs')
app.get('/', (req, res) => {
  res.send('首頁')
})

// 設計 middleware
app.use('/', express.static(path.join(__dirname, '..', 'public')))
app.use('/upload', express.static(path.join(__dirname, '..', 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/api', apis)
app.use(pages)

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Ordering drinks application listening on port: http://localhost:${port}`)
})
