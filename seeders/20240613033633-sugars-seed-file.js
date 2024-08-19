'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sugars',
      ['無糖', '微糖(三分甜)', '半糖(五分甜)', '少糖(八分甜)', '正常甜']
        .map(item => {
          return {
            level: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sugars', null)
  }
}
