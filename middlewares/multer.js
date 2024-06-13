// 加上這個 middleware 以後，multer 只要碰到 request 裡面有圖片的檔案，就會自動把檔案複製到 dest 指定的資料夾 temp
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// 建立暫存圖片的資料夾 temp
const tempDir = path.join(__dirname, '../', 'temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

const upload = multer({ dest: 'temp/' })
module.exports = upload
