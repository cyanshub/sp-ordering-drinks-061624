'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // size尺寸可以出現在很多筆訂單order, 但每筆訂單order只會出現一種尺寸size
      Size.hasMany(models.Order, { foreignKey: 'sizeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      Size.hasMany(models.Cart, { foreignKey: 'sizeId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    }
  }
  Size.init({
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Size',
    tableName: 'sizes',
    underscored: true
  })
  return Size
}
