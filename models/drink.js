'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Drink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // user經由order可以購買很多種drink, drink經由order也可以被很多user購買
      Drink.hasMany(models.Order, { foreignKey: 'drinkId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      Drink.hasMany(models.Cart, { foreignKey: 'drinkId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      // store經由ownership可以販賣多種drink, drink經由ownership也可以被很多store販賣
      Drink.belongsToMany(models.Store, {
        through: models.Ownership,
        foreignKey: 'drinkId',
        as: 'ownedStores'
      })
    }
  }
  Drink.init({
    name: DataTypes.STRING,
    priceM: DataTypes.INTEGER,
    priceL: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Drink',
    tableName: 'drinks',
    underscored: true
  })
  return Drink
}
