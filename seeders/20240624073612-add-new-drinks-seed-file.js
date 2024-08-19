'use strict'

const drinks = require('../data/drinks_update_240624.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 載入 drinks.json 資料

    console.log('drinks.json:', drinks)

    await queryInterface.bulkInsert('drinks',
      drinks.map(drink => {
        return {
          name: drink.name,
          price_M: drink.price_M,
          price_L: drink.price_L,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
  },

  async down (queryInterface, Sequelize) {
    const limit = drinks.length // 要刪除的留言數量

    // 查詢前 N 條留言的 ID
    const drinksToDelete = await queryInterface.sequelize.query(
      'SELECT id FROM drinks ORDER BY id DESC LIMIT :limit',
      {
        replacements: { limit },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    // 提取 ID 列表
    const idsToDelete = drinksToDelete.map(drink => drink.id)

    if (idsToDelete.length > 0) {
      // 刪除查詢到的飲料
      await queryInterface.bulkDelete('drinks', {
        id: idsToDelete
      })
    } else {
      console.log('No drinks found to delete')
    }
  }
}
