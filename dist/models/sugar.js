'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Sugar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // sugar甜度可以出現在很多筆訂單order, 但每筆訂單order只會出現一種甜度sugar
      Sugar.hasMany(models.Order, { foreignKey: 'sugarId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      Sugar.hasMany(models.Cart, { foreignKey: 'sugarId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    }
  }
  Sugar.init({
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sugar',
    tableName: 'sugars',
    underscored: true
  })
  return Sugar
}
