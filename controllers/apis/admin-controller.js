// 抽取 services 層
const adminServices = require('../../services/admin-services')

const adminController = {
  getStores: (req, res, next) => {
    return adminServices.getStores(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  postStore: (req, res, next) => {
    return adminServices.postStore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  getStore: (req, res, next) => {
    return adminServices.getStore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  addOwnership: (req, res, next) => {
    return adminServices.addOwnership(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  removeOwnership: (req, res, next) => {
    return adminServices.removeOwnership(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  putStore: (req, res, next) => {
    return adminServices.putStore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  deleteStore: (req, res, next) => {
    return adminServices.deleteStore(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  patchUser: (req, res, next) => {
    return adminServices.patchUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  getOrders: (req, res, next) => {
    return adminServices.getOrders(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  deleteOrder: (req, res, next) => {
    return adminServices.deleteOrder(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }

}

module.exports = adminController
