// 載入工具
import moment from 'moment-timezone' // 轉換時區

// 定義型別
type KeyPath = (string | number)[] // 定義 keyPath 的型別，可以是字串或數字的陣列

interface Item {
  name: string
  fullAddress: string
  createdAt?: string // 根據需要定義 createdAt
  [key: string]: any // 定義動態屬性
}

// 處理關鍵字查詢
const filterKeyword = <T extends Item>(items: T[], keyword: string): T[] => {
  return items.filter(
    (item) => item.name.toLowerCase().includes(keyword.toLowerCase()) || item.fullAddress.toLowerCase().includes(keyword.toLowerCase())
  )
}

// Fisher-Yates 洗牌演算法
const shuffleFisherYates = <T>(items: T[]): T[] => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]] // 交換元素位置
  }
  return items
}

// 過濾唯一值
const filterUnique = <T>(items: T[], keyPath: KeyPath): T[] => {
  const seen = new Set() // 使用 Set 來追蹤已經出現過的屬性
  return items
    .map((item) => {
      const uniqueValue = getNestedValue(item, keyPath)
      return uniqueValue !== undefined && seen.has(uniqueValue) ? null : (seen.add(uniqueValue), item) // 如果值已經出現過，返回 null；否則加入 Set
    })
    .filter(Boolean) as T[] // 過濾掉為 null 的值
}

// 逐層深入物件的嵌套結構，獲取嵌套屬性的值
const getNestedValue = <T>(obj: T, keys: KeyPath): any => {
  if (keys.length === 0) return obj

  const [firstKey, ...restKeys] = keys

  if (obj && typeof obj === 'object' && firstKey in obj) {
    // 遞迴呼叫來訪問下一層
    return getNestedValue((obj as any)[firstKey], restKeys)
  }

  return undefined // 如果某層的屬性不存在，返回 undefined
}

// 將 UTC 時間轉換為台灣時間
const convertToTaiwanTime = <T extends { createdAt: string }>(items: T[]): T[] => {
  return items.map((item) => {
    const createdAtUTC = item.createdAt
    const createdAtTaiwan = moment.utc(createdAtUTC).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
    return {
      ...item,
      createdAt: createdAtTaiwan
    }
  })
}

// 最後導出所有函數
export { filterKeyword, shuffleFisherYates, filterUnique, getNestedValue, convertToTaiwanTime }
