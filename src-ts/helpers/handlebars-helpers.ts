import { HelperOptions } from 'handlebars'

// 載入所需的 npm 套件
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// 定義 types
type IfCond = string | number | boolean

type Cart = {
  Size: { level: string }
  Drink: { priceL: number; priceM: number }
  amount: number
}

type Carts = Cart[]

export default {
  ifCond: function (a: IfCond, b: IfCond, options: HelperOptions) {
    return a === b ? options.fn(this) : options.inverse(this)
  }, // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤

  // 判斷頁碼器是否顯示
  ifLarger: function (a: number, b: number, options: HelperOptions) {
    return a > b ? options.fn(this) : options.inverse(this)
  }, // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤

  formatNumber: function (number: number) {
    // 格式化數字為千分位表示
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  relativeTimeFromNow: (a: string | number | Date) => dayjs(a).fromNow(),

  formatTime: (a: string | number | Date) => dayjs(a).format('YYYY-MM-DD HH:mm'),

  multiply: (...args: (number | string)[]) => {
    // 傳進來的數字被硬轉成字串, 要轉回來
    const numbers = args.map((arg) => (typeof arg === 'string' ? parseFloat(arg) : arg)).filter((arg): arg is number => !isNaN(arg))

    if (numbers.length === 0) {
      return 'Invalid input'
    }

    const init = 1
    const product = numbers.reduce((acc, curr) => acc * curr, init)

    return product.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  sum: (...args: (number | string)[]): string | number => {
    // 傳進來的數字被硬轉成字串, 要轉回來
    const numbers = args.map((arg) => (typeof arg === 'string' ? parseFloat(arg) : arg)).filter((arg): arg is number => !isNaN(arg))

    if (numbers.length === 0) {
      return 'Invalid input'
    }

    const init = 0
    const total = numbers.reduce((acc, curr) => acc + curr, init)

    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  removeString: (name: string, ...args: string[]) => {
    const stringsToRemove = args.filter((arg) => typeof arg === 'string')
    stringsToRemove.forEach((stringToRemove) => {
      name = name.replace(new RegExp(stringToRemove, 'g'), '')
    })
    return name
  },

  sumPrices: (carts: Carts) => {
    let total = 0
    carts.forEach((cart) => {
      if (cart.Size.level === '大杯(L)') {
        total += cart.Drink.priceL * cart.amount
      } else {
        total += cart.Drink.priceM * cart.amount
      }
    })
    return total
  }
}
