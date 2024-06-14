'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('drinks', [
      { name: '50嵐 大正紅茶', price: 35 },
      { name: '50嵐 茉莉原淬綠茶', price: 35 },
      { name: '50嵐 布朗紅茶拿鐵', price: 50 },
      { name: 'CoCo 大正紅茶', price: 35 },
      { name: 'CoCo 茉莉原淬綠茶', price: 35 },
      { name: 'CoCo 布朗紅茶拿鐵', price: 50 },
      { name: '迷克夏 大正紅茶', price: 35 },
      { name: '迷克夏 茉莉原淬綠茶', price: 35 },
      { name: '迷克夏 布朗紅茶拿鐵', price: 50 }
    ]
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
