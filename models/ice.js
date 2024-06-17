'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Ice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // ice 冰量可以出現在很多筆訂單order, 但每筆訂單order只會出現一種冰量ice
      Ice.hasMany(models.Order, { foreignKey: 'iceId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      Ice.hasMany(models.Cart, { foreignKey: 'iceId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    }
  }
  Ice.init({
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ice',
    tableName: 'ices',
    underscored: true
  })
  return Ice
}
