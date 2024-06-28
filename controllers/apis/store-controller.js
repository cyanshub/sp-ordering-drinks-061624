// 抽取共用 services 層
const storeServices = require('../../services/store-services')

const storeController = {
  getStores: (req, res, next) => {
    return storeServices.getStores(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = storeController
