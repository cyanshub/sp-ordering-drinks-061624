'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 載入 drinks.json 資料
    const drinks = require('../data/drinks.json')
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
    await queryInterface.bulkDelete('drinks', null)
  }
}
