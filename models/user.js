'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      // user經由order可以購買很多種drink, drink經由order也可以被很多user購買
      User.hasMany(models.Order, { foreignKey: 'userId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })

      User.hasMany(models.Cart, { foreignKey: 'userId', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true
  })
  return User
}
