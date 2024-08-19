'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ices',
      ['常溫', '去冰', '微冰', '少冰', '正常冰']
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
    await queryInterface.bulkDelete('ices', null)
  }
}
