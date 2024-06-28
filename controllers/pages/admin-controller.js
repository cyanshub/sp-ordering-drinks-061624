// 抽取 services 層
const adminServices = require('../../services/admin-services')

const adminController = {
  // 店家相關
  getStores: (req, res, next) => {
    return adminServices.getStores(req, (err, data) => err ? next(err) : res.render('admin/stores', data))
  },
  createStore: (req, res, next) => {
    return res.render('admin/create-store')
  },
  postStore: (req, res, next) => {
    return adminServices.postStore(req, (err, data) => {
      if (err) return next(err)
      req.session.createdData = data
      req.flash('success_messages', '成功新增店家!')
      res.redirect('/admin/stores')
    })
  },
  getStore: (req, res, next) => {
    return adminServices.getStore(req, (err, data) => err ? next(err) : res.render('admin/store', data))
  },
  editStore: (req, res, next) => {
    return adminServices.editStore(req, (err, data) => err ? next(err) : res.render('admin/edit-store', data))
  },
  putStore: (req, res, next) => {
    return adminServices.putStore(req, (err, data) => {
      if (err) return next(err)
      req.session.editedData = data
      req.flash('success_messages', '變更成功!')
      res.redirect('/admin/stores')
    })
  },
  deleteStore: (req, res, next) => {
    return adminServices.deleteStore(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      req.flash('success_messages', '刪除成功!')
      res.redirect('back')
    })
  },

  // 使用者相關
  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  },
  patchUser: (req, res, next) => {
    return adminServices.patchUser(req, (err, data) => {
      if (err) return next(err)
      req.session.patchedData = data
      res.redirect('back')
    })
  },
  addOwnership: (req, res, next) => {
    return adminServices.addOwnership(req, (err, data) => {
      if (err) return next(err)
      req.session.addedData = data
      return setTimeout(() => res.redirect('back'), 3000)
    })
  },
  removeOwnership: (req, res, next) => {
    return adminServices.removeOwnership(req, (err, data) => {
      if (err) return next(err)
      req.session.removedData = data
      return setTimeout(() => res.redirect('back'), 3000)
    })
  },
  getOrders: (req, res, next) => {
    return adminServices.getOrders(req, (err, data) => err ? next(err) : res.render('admin/orders', data))
  },
  deleteOrder: (req, res, next) => {
    return adminServices.deleteOrder(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      return res.redirect('back')
    })
  }
}

module.exports = adminController
