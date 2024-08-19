'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 購物車與商店的關聯
    await queryInterface.changeColumn('carts', 'store_id', {
      type: Sequelize.INTEGER,
      references: { model: 'stores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 購物車與商品的關聯
    await queryInterface.changeColumn('carts', 'drink_id', {
      type: Sequelize.INTEGER,
      references: { model: 'drinks', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 購物車與使用者的關聯
    await queryInterface.changeColumn('carts', 'user_id', {
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 購物車與大小杯的關聯
    await queryInterface.changeColumn('carts', 'size_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sizes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 購物車與甜度的關聯
    await queryInterface.changeColumn('carts', 'sugar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'sugars', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 購物車與冰量的關聯
    await queryInterface.changeColumn('carts', 'ice_id', {
      type: Sequelize.INTEGER,
      references: { model: 'ices', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    // 購物車與商店的關聯
    await queryInterface.changeColumn('carts', 'store_id', {
      type: Sequelize.INTEGER
    })

    // 購物車與商品的關聯
    await queryInterface.changeColumn('carts', 'drink_id', {
      type: Sequelize.INTEGER
    })

    // 購物車與使用者的關聯
    await queryInterface.changeColumn('carts', 'user_id', {
      type: Sequelize.INTEGER
    })

    // 購物車與大小杯的關聯
    await queryInterface.changeColumn('carts', 'size_id', {
      type: Sequelize.INTEGER
    })

    // 購物車與甜度的關聯
    await queryInterface.changeColumn('carts', 'sugar_id', {
      type: Sequelize.INTEGER
    })

    // 購物車與冰量的關聯
    await queryInterface.changeColumn('carts', 'ice_id', {
      type: Sequelize.INTEGER
    })
  }
}
