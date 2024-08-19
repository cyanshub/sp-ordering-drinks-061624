'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('sizes',
      ['中杯(M)', '大杯(L)']
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
    await queryInterface.bulkDelete('sizes', null)
  }
}
