// 引入資料表 model
const { Store, User, Drink, Ownership, Size, Sugar, Ice, Order } = require('../models')

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
  getStore: (req, res, next) => {
    return Promise.all([
      Store.findByPk(req.params.id, {
        include: [{
          model: Drink,
          as: 'ownedDrinks',
          order: [['id', 'ASC']]
        }]
      }),
      // 撈出資料庫所有飲料, 讓個別店家勾選, 登陸進 ownerships
      Drink.findAll({ raw: true })
    ])

      .then(([store, drinks]) => {
        if (!store) throw new Error('該商店不存在!')
        // 取出店家有販賣的 drink id 當作販賣清單
        const ownedDrinksId = store.ownedDrinks ? store.ownedDrinks.map(od => od.id) : []

        // 將所有飲料逐一比對販賣清單中的飲料, 並將有無結果用isOwned變數儲存
        const drinksData = drinks.map(d => ({
          ...d,
          isOwned: ownedDrinksId.includes(d.id)
        }))

        store = store.toJSON()
        return res.render('admin/store', { store, drinks: drinksData })
      })
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
  },
  addOwnership: (req, res, next) => {
    const { storeId } = req.body // 從隱藏input拿取店家 id
    const drinkId = req.params.drinkId // 從路由拿取商品 id
    return Promise.all([
      Drink.findByPk(drinkId),
      Ownership.findOne({ where: { storeId, drinkId } })
    ])
      .then(([drink, ownership]) => {
        if (!drink) throw new Error('該商品不存在!')
        if (ownership) throw new Error('商品已在販賣清單!')
        return Ownership.create({ storeId, drinkId })
      })
      .then(newOwnership => {
        // 點集變更後, 稍等一下才轉址
        setTimeout(function () { res.redirect('back') }, 1000)
        return { ownership: newOwnership }
      })
      .catch(err => next(err))
  },
  removeOwnership: (req, res, next) => {
    const { storeId } = req.body // 從隱藏input拿取店家 id
    const drinkId = req.params.drinkId // 從路由拿取商品 id

    return Promise.all([
      Drink.findByPk(drinkId),
      Ownership.findOne({ where: { storeId, drinkId } })
    ])
      .then(([drink, ownership]) => {
        if (!drink) throw new Error('該商品不存在!')
        if (!ownership) throw new Error('商品不在販賣清單!')
        return ownership.destroy()
      })
      .then(deletedOwnership => {
        // 點集變更後, 稍等一下才轉址
        setTimeout(function () { res.redirect('back') }, 1000)

        return { ownership: deletedOwnership }
      })
      .catch(err => next(err))
  },
  getOrders: (req, res, next) => {
    const userAuth = req.user
    if (userAuth.email !== 'root@example.com') throw new Error('只有專責管理員可以訪問此頁面!')
    const DEFAULT_LIMIT = 10 // 預設每頁顯示幾筆資料
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)
    const keyword = req.query.keyword ? req.query.keyword.trim() : '' // 取得並修剪關鍵字
    const whereClause = { // find系列語法查詢條件
      ...keyword.length > 0
        ? {
            [Op.or]: [
              literal(`LOWER(User.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(User.email) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Drink.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.name) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`LOWER(Store.address) LIKE '%${keyword.toLowerCase()}%'`),
              literal(`DATE_ADD(Order.created_at, INTERVAL 8 HOUR) LIKE '%${keyword}%'`)
            ]
          }
        : {}
    }

    return Order.findAndCountAll({
      raw: true,
      nest: true,
      where: whereClause,
      order: [['id', 'DESC']], // 依建立時間降續排列
      include: [User, Drink, Store, Size, Sugar, Ice],
      offset,
      limit
    })
      .then(orders => {
        const data = orders.rows
        res.render('admin/orders', {
          orders: data,
          pagination: getPagination(limit, page, orders.count),
          isSearched: '/admin/orders', // 決定搜尋表單發送位置
          keyword,
          count: orders.count
        })
      })
      .catch(err => next(err))
  },
  deleteOrder: (req, res, next) => {
    const orderId = Number(req.params.orderId)
    return Order.findByPk(orderId)
      .then(order => {
        if (!order) throw new Error('指定的訂單不存在!')
        return order.destroy()
      })
      .then(deletedOrder => {
        req.flash('success_messages', '成功取消訂單!')
        res.redirect('back')
        return { order: deletedOrder }
      })
  }
}

module.exports = adminController
