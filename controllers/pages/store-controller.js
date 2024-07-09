// 抽取 services 層
const storeServices = require('../../services/store-services')

const storeController = {
  getStores: (req, res, next) => {
    return storeServices.getStores(req, (err, data) => err ? next(err) : res.render('stores/stores', data))
  },
  getStore: (req, res, next) => {
    return storeServices.getStore(req, (err, data) => err ? next(err) : res.render('stores/store', data))
  }
}

module.exports = storeController
