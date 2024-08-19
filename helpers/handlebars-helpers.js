// 載入所需的 npm 套件
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }, // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤

  // 判斷頁碼器是否顯示
  ifLarger: function (a, b, options) {
    return a > b ? options.fn(this) : options.inverse(this)
  }, // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤

  formatNumber: function (number) {
    // 判斷输入是否是数字
    if (typeof number !== 'number') {
      return number
    }

    // 格式化數字為千分位表示
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  relativeTimeFromNow: a => dayjs(a).fromNow(),

  formatTime: a => dayjs(a).format('YYYY-MM-DD HH:mm'),

  multiply: (...args) => {
    // 過濾掉非數字的元素
    const numbers = args.filter(arg => typeof arg === 'number')

    // 如果所有的參數都不是數字，返回 'Invalid input'
    if (numbers.length === 0) {
      return 'Invalid input'
    }

    // 計算乘積
    // acc（累加器，accumulator; curr（目前元素，current element）
    const init = 1 // 初始值 1, 逐一與crr相乘後, 放入acc, 直到處理完成為止
    const product = numbers.reduce((acc, curr) => acc * curr, init)

    // 將結果以千分位顯示
    return product
  },

  sum: (...args) => {
    // 過濾掉非數字的元素
    const numbers = args.filter(arg => typeof arg === 'number')

    // 如果所有的參數都不是數字，返回 'Invalid input'
    if (numbers.length === 0) {
      return 'Invalid input'
    }

    // 計算加總
    // acc（累加器，accumulator; curr（目前元素，current element）
    const init = 0 // 初始值 0, 逐一與crr相加後, 放入acc, 直到處理完成為止
    const total = numbers.reduce((acc, curr) => acc + curr, init)

    // 將結果以千分位顯示
    return total
  },
  removeString: (name, ...args) => {
    const stringsToRemove = args.filter(arg => typeof arg === 'string')
    stringsToRemove.forEach(stringToRemove => {
      name = name.replace(new RegExp(stringToRemove), '')
    })
    return name
  },

  sumPrices: carts => {
    let total = 0
    carts.forEach(cart => {
      if (cart.Size.level === '大杯(L)') {
        total += cart.Drink.priceL * cart.amount
      } else {
        total += cart.Drink.priceM * cart.amount
      }
    })
    return total
  }

}
