const { getUser, ensureAuthenticated } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 確保使用者經過登入驗證
  if (ensureAuthenticated(req)) {
    return next()
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  // 確保使用者經過登入驗證
  if (ensureAuthenticated(req)) {
    // 確保使用者的 isAdmin 為 true or false
    if (getUser(req).isAdmin) return next()
    res.redirect('/')
  } else {
    res.redirect('/signin')
  }
}

module.exports = { authenticated, authenticatedAdmin }
