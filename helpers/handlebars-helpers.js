// 載入所需的 npm 套件
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }, // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤

  formatNumber: function (number) {
    // 判斷输入是否是数字
    if (typeof number !== 'number') {
      return number
    }

    // 格式化數字為千分位表示
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  relativeTimeFromNow: a => dayjs(a).fromNow()
}
