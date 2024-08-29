// 載入需要使用的工具
import express from 'express'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv'
import path from 'path'
import methodOverride from 'method-override'
import handlebarsHelpers from './helpers/handlebars-helpers'
import flash from 'connect-flash'
import session from 'express-session'
import { pages, apis } from './routes'
import passport from './config/passport' // 注意要導入自訂的
import { getUser } from './helpers/auth-helpers'

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

// 設計 middleware
// middleware
app.use('/', express.static(path.join(__dirname, '..', 'public')))
app.use('/upload', express.static(path.join(__dirname, '..', 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

// middleware: 利用 session 啟用 flash message
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET, // session 的 加密密鑰
  resave: false, // 在請求期間沒有修改會話，則不會重新保存會話
  saveUninitialized: false, // 只有在會話內容初始化後（例如設置某個值）才會儲存會話
  cookie: { secure: false } // 用來配置會話 ID cookie 的屬性。secure: false 表示 cookie 可以在不安全的 HTTP 連接上傳送（例如 http://）
}))

// middleware: 使用者登入相關, 設定 passport 與 passport 化已宣告的 session
app.use(passport.initialize()) // 令 passport 初始化
app.use(passport.session()) // 啟動 passport 的 session 功能; 必須放在原本的session之後


// middleware: 設計專案全域變數, 所有路由都會經過的 middleware
app.use((req, res, next) => {
  // views/partial/messages.hbs 設計當以下兩個變數存在時, 會出現對應的畫面
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.userAuth = getUser(req)
  next()
})

app.use('/api', apis)
app.use(pages)

// 啟動並監聽網站
app.listen(port, () => {
  console.info(`Ordering drinks application listening on port: http://localhost:${port}`)
})
