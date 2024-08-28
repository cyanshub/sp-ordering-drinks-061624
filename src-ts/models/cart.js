'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // 每筆訂單只會出現一種尺寸、甜度、冰量
      Cart.belongsTo(models.Size, { foreignKey: 'sizeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
      Cart.belongsTo(models.Sugar, { foreignKey: 'sugarId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
      Cart.belongsTo(models.Ice, { foreignKey: 'iceId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      // user經由cart可以購買很多種drink, drink經由cart也可以被很多user購買
      Cart.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
      Cart.belongsTo(models.Drink, { foreignKey: 'drinkId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
      Cart.belongsTo(models.Store, { foreignKey: 'storeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    }
  }
  Cart.init({
    amount: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    drinkId: DataTypes.INTEGER,
    sizeId: DataTypes.INTEGER,
    sugarId: DataTypes.INTEGER,
    iceId: DataTypes.INTEGER,
    storeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    underscored: true
  })
  return Cart
}
