// 引入資料表 model
const { Store, User } = require('../models')

// 載入所需的工具
const { getOffset, getPagination } = require('../helpers/pagination-helpers.js')
const { localCoverHandler } = require('../helpers/file-helpers.js')
const { Op, literal } = require('sequelize')

const adminController = {
  // 店家相關
  getStores: (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字

    return Store.findAndCountAll({
      where: {
        // 展開運算子的優先級較低, 會比較慢判斷
        ...keyword.length > 0
          ? {
              [Op.or]: [
                literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
                literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`)
              ]
            }
          : {}
      },
      raw: true,
      offset,
      limit,
      nest: true,
      order: [['id', 'DESC']]
    })
      .then(stores => {
        const data = stores.rows
        return res.render('admin/stores', {
          stores: data,
          pagination: getPagination(limit, page, stores.count),
          isSearched: '/admin/stores', // 決定搜尋表單發送位置為後台 index 頁面
          keyword
        })
      })
      .catch(err => next(err))
  },
  createStore: (req, res, next) => {
    return res.render('admin/create-store')
  },
  postStore: (req, res, next) => {
    const { name, address, phone } = req.body
    const file = req.file // 根據之前修正的form content, 把檔案從req取出來

    // 檢驗必填欄位是否存在
    if (!name) throw new Error('店家名稱為必填欄位!')

    // 把取出的檔案 file 傳給 file-helper 處理
    return localCoverHandler(file)
      .then(filePath => {
        return Store.create({
          name,
          address,
          phone,
          cover: filePath || null
        })
      })
      .then(newStore => {
        res.redirect('/admin/stores')
        return { store: newStore }
      })
      .catch(err => next(err))
  },
  editStore: (req, res, next) => {
    return Store.findByPk(req.params.id, { raw: true })
      .then(store => {
        if (!store) throw new Error('該店家不存在!')
        res.render('admin/edit-store', { store })
      })
      .catch(err => { next(err) })
  },
  putStore: (req, res, next) => {
    const { name, address, phone } = req.body
    if (!name) throw new Error('案場名稱為必填欄位!') // 檢驗必填欄位是否存在
    const file = req.file // 拿到 middleware: multer 上傳的圖片
    // 使用 Promise.all 語法, 待所有非同步事件處理完才跳入下一個.then()
    // Promise.all([非同步A, 非同步B]).then(([A結果, B結果]) => {...})
    return Promise.all([
      Store.findByPk(req.params.id),
      localCoverHandler(file)
    ])
      .then(([store, filePath]) => {
        if (!store) throw new Error('該案場不存在!')
        return store.update({
          name,
          address,
          phone,
          cover: filePath || store.cover
        })
      })
      .then(editStore => {
        req.flash('success_messages', '變更成功!')
        res.redirect('back')
        return editStore
      })
      .catch(err => next(err))
  },
  deleteStore: (req, res, next) => {
    return Store.findByPk(req.params.id)
      .then(store => {
        if (!store) throw new Error('該案場不存在!')
        return store.destroy()
      })
      .then(deleteStore => {
        res.redirect('/admin/stores')
        return deleteStore
      })
  },

  // 使用者相關
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      attributes: { exclude: ['password'] }
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      // 避免密碼資料外洩
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        if (user.email === 'root@example.com') {
          const err = new Error('error_messages', '禁止變更 root 使用者權限!')
          err.status = 404
          throw err
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(editedUser => {
        res.redirect('/admin/users')
        return editedUser
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
