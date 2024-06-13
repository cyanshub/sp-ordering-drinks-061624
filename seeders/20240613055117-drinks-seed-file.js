'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('drinks', [
      { name: '大正紅茶', price: 35 },
      { name: '茉莉原淬綠茶', price: 35 },
      { name: '布朗紅茶拿鐵', price: 50 }]
      .map(item => {
        return {
          name: item.name,
          price: item.price,
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
