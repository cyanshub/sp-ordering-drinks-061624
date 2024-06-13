// 計算偏移量: 搭配 sequelize 查詢的偏移功能
const getOffset = (limit = 10, page = 1) => (page - 1) * limit // 回傳篇移量

// 計算頁碼器所需資訊:頁碼陣列、總共幾頁、在第幾頁、下一頁、上一頁
const getPagination = (limit = 10, page = 1, total = 100) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page < totalPage ? page : totalPage
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  // 改成可省略頁碼的形式
  const setCounts = 2 // 決定開頭跟結尾顯示多少頁碼

  // 預設顯示前幾頁: 考量當總頁數少於預設顯示頁數時, 將預設顯示頁數進行縮減
  const initialPages = Array.from({ length: setCounts }, (_, i) => i + 1)
    .filter(page => page <= totalPage)

  // 預設顯示後幾頁: 考量當頁數少於預設顯示頁數時, 將預設顯示頁數進行縮減, 防止出現零
  const finalPages = Array.from({ length: setCounts }, (_, i) => (i + 1) - setCounts + totalPage)
    .filter(page => page > setCounts)

  // 動態顯示中間段要顯示的頁碼
  const visiblePages = []
  const visibleCounts = 2 // 決定中間頁碼前後顯示多少頁碼

  const range = {
    start: Math.max(setCounts + 1, currentPage - visibleCounts),
    end: Math.min(totalPage - setCounts, currentPage + visibleCounts)
  }

  for (let i = range.start; i <= range.end; i++) {
    visiblePages.push(i)
  }

  const hasPrevEllipsis = range.start > (setCounts + 1)
  const hasNextEllipsis = range.end < totalPage - setCounts

  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next,
    initialPages,
    visiblePages,
    finalPages,
    hasPrevEllipsis,
    hasNextEllipsis
  }
}

module.exports = { getOffset, getPagination }
