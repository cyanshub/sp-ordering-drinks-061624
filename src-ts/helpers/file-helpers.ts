import * as fs from 'fs'
import * as path from 'path'

// 定義 types
interface File {
  originalname: string;
  path: string;
}

// 為參數定義型別
const localCoverHandler = (file: File | null | undefined): Promise<string | null> => {
  // 建立非同步語的語法的物件實例
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 檢查檔案是否存在

    // 在專案建立一個用於保存圖片的資料夾upload, 如果專案根目錄不存在則建立之
    const uploadCoverDir = path.resolve(__dirname, '../../', 'upload/covers')
    if (!fs.existsSync(uploadCoverDir)) {
      fs.mkdirSync(uploadCoverDir, { recursive: true })
    }

    // 準備將傳入的檔案, 寫入 upload 資料夾
    const filePath = path.join(uploadCoverDir, file.originalname)

    // 將 fs 工具以非同步語法進行操作
    return fs.promises.readFile(file.path) // 讀取檔案路徑進行複製, 得到檔案的數據流變數 data
      // 將數據流變數data寫入指定路徑filePath
      .then(data => fs.promises.writeFile(filePath, data))
      // 回傳一個類似filePath概念的值(受限於靜態檔案)
      .then(() => resolve(`/upload/covers/${file.originalname}`))
      .catch(err => reject(err))
  })
}
const localAvatarHandler = (file: File | null | undefined): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null) // 檢查檔案是否存在

    // 在專案建立一個用於保存圖片的資料夾upload, 如果專案根目錄不存在則建立之
    const uploadAvatarDir = path.resolve(__dirname, '../../', 'upload/avatars')
    if (!fs.existsSync(uploadAvatarDir)) {
      fs.mkdirSync(uploadAvatarDir, { recursive: true })
    }

    // 準備將傳入的檔案, 寫入 upload/avatar 資料夾
    const filePath = path.join(uploadAvatarDir, file.originalname)

    // 將 fs 工具以非同步語法進行操作
    return fs.promises.readFile(file.path) // 讀取檔案路徑進行複製, 得到檔案的數據流變數 data
      // 將數據流變數data寫入指定路徑filePath
      .then(data => fs.promises.writeFile(filePath, data))
      // 回傳一個類似filePath概念的值(受限於靜態檔案)
      .then(() => resolve(`/upload/avatars/${file.originalname}`))
      .catch(err => reject(err))
  })
}

export { localCoverHandler, localAvatarHandler }
