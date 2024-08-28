'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Ownership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Ownership.init({
    storeId: DataTypes.INTEGER,
    drinkId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ownership',
    tableName: 'ownerships',
    underscored: true
  })
  return Ownership
}
