'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stores', [{
      name: '迷客夏 臺北西門町店',
      address: '台北市萬華區漢中街126號',
      cover: 'https://lh5.googleusercontent.com/p/AF1QipN-udI2XTJc_i9jGZN8G8FzqK8RstqvHWF_g-ek=w408-h306-k-no',
      phone: '02-23706020',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stotes', null)
  }
}
