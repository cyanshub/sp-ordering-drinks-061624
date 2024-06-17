'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 在 order 上記錄使用者購買飲料的店家資訊
      Store.hasMany(models.Order, { foreignKey: 'storeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      Store.hasMany(models.Cart, { foreignKey: 'storeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      // store經由ownership可以販賣多種drink, drink經由ownership也可以被很多store販賣
      Store.belongsToMany(models.Drink, {
        through: models.Ownership,
        foreignKey: 'storeId',
        as: 'ownedDrinks'
      })
    }
  }
  Store.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    cover: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Store',
    tableName: 'stores',
    underscored: true
  })
  return Store
}
