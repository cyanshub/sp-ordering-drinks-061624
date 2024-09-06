// 加上這個 middleware 以後，multer 只要碰到 request 裡面有圖片的檔案，就會自動把檔案複製到 dest 指定的資料夾 temp
import multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'

// 建立暫存圖片的資料夾 temp
const tempDir = path.resolve(__dirname, '../../temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const upload = multer({ dest: 'temp/' })
export default upload
