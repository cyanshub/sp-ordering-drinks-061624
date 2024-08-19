'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 訂單與商品的關聯
    await queryInterface.changeColumn('orders', 'drink_id', {
      type: Sequelize.INTEGER,
      references: { model: 'drinks', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 訂單與使用者的關聯
    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 訂單與大小杯的關聯
    await queryInterface.changeColumn('orders', 'size_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sizes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 訂單與甜度的關聯
    await queryInterface.changeColumn('orders', 'sugar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sugars', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 訂單與冰量的關聯
    await queryInterface.changeColumn('orders', 'ice_id', {
      type: Sequelize.INTEGER,
      references: { model: 'ices', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    // 訂單與商品的關聯
    await queryInterface.changeColumn('orders', 'drink_id', {
      type: Sequelize.INTEGER
    })

    // 訂單與使用者的關聯
    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.INTEGER
    })

    // 訂單與大小杯的關聯
    await queryInterface.changeColumn('orders', 'size_id', {
      type: Sequelize.INTEGER

    })

    // 訂單與甜度的關聯
    await queryInterface.changeColumn('orders', 'sugar_id', {
      type: Sequelize.INTEGER
    })

    // 訂單與冰量的關聯
    await queryInterface.changeColumn('orders', 'ice_id', {
      type: Sequelize.INTEGER
    })
  }
}
