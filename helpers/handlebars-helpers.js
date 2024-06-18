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
    const product = numbers.reduce((acc, curr) => acc * curr, 1)

    // 將結果以千分位顯示
    return product.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
