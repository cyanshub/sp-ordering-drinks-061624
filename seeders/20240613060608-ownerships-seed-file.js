'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 查詢stores id, 獲取名稱包括迷客夏的的id
    const stores = await queryInterface.sequelize.query(
      // 'SELECT id FROM stores WHERE name LIKE "%迷客夏%";',
      'SELECT id FROM stores;',
      { type: Sequelize.QueryTypes.SELECT })

    // 查詢所有 drinks id, 拿到所有飲料
    const drinks = await queryInterface.sequelize.query(
      'SELECT id FROM drinks;',
      { type: Sequelize.QueryTypes.SELECT })

    // 假設選到到的storeId有賣撈出來的飲料
    for (let i = 0; i < stores.length; i++) {
      await queryInterface.bulkInsert('ownerships',
        drinks.map(item => {
          return {
            store_id: stores[i].id,
            drink_id: item.id,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      )
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ownerships', null)
  }
}
