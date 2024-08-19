'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 經營權: 與商店的關聯
    await queryInterface.changeColumn('ownerships', 'drink_id', {
      type: Sequelize.INTEGER,
      references: { model: 'drinks', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // 經營權: 與商品的關聯
    await queryInterface.changeColumn('ownerships', 'store_id', {
      type: Sequelize.INTEGER,
      references: { model: 'stores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    // 經營權: 與商店的關聯
    await queryInterface.changeColumn('ownerships', 'drink_id', {
      type: Sequelize.INTEGER
    })

    // 經營權: 與商品的關聯
    await queryInterface.changeColumn('ownerships', 'store_id', {
      type: Sequelize.INTEGER
    })
  }
}
