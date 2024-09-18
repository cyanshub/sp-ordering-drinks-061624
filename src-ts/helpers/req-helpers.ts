// 載入所需工具
import dotenv from 'dotenv'
import axios from 'axios'
import moment from 'moment-timezone'

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// 決定開關: 將環境變數轉為布林值, 忽略大小寫
const toggleServer =
  process.env.TOGGLE_RENDER_APP_ALIVE?.toLowerCase() === 'true'

// 指定的網站 URL
const urlServer = process.env.URL_SERVER_RENDER_APP

let i1 = 1 // 紀錄發送請求的次數
// 定義發送請求的函數
const reqServer = async () => {
  try {
    console.log(`向 ${urlServer} 發送請求的次數: `, i1++)
    console.log(
      '發送請求時間: ',
      new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    )
    console.log('')
    const resFromServer = await axios.get(urlServer)
    console.log(`${urlServer}: status code: ${resFromServer.status}`)
  } catch (error) {
    // 斷言 error 是 Error 類型
    console.error(`Error: ${(error as Error).message}`)
  }
}

// Render.com 如果15分鐘沒有接到連線請求會自動進入怠速狀態
const time = 10 * 60 * 1000 // 時間單位為毫秒

// 將環境變數轉為數字
const breakHour =
  parseInt(process.env.TOGGLE_RENDER_APP_ALIVE_BREAK_HOUR, 10) || 0 // 預設凌晨 0 點
const continueHour =
  parseInt(process.env.TOGGLE_RENDER_APP_ALIVE_CONTINUE_HOUR, 10) || 8 // 預設早晨 8 點

// 設定台北時區
const getCurrentHour = () => moment.tz('Asia/Taipei').hour()

// 檢查當前時間是否在不允許發送請求的範圍內
const isQuietHours = () => {
  const currentHour = getCurrentHour() // 使用台北時區的當前小時

  // 情況 1：當暫停服務的時間數字小於開始服務時間的數字
  // 情況 2：當暫停服務的時間數字大於開始服務時間的數字
  return breakHour < continueHour
    ? currentHour >= breakHour && currentHour < continueHour
    : currentHour >= breakHour || currentHour < continueHour
}

// 執行處理程序
const scheduleKeepAliveReq = () => {
  if (toggleServer) {
    // 立即檢查並發送一次請求（如果不在暫停服務時間內）
    !isQuietHours()
      ? reqServer()
      : console.log('目前為暫停服務時間, 故暫停發送請求')

    // 定時檢查時間並發送請求
    setInterval(() => {
      !isQuietHours()
        ? reqServer()
        : console.log('目前為暫停服務時間, 故暫停發送請求')
    }, time)
  }
}

export default scheduleKeepAliveReq




