'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('drinks', 'price_M', {
      type: Sequelize.INTEGER
    })
    queryInterface.addColumn('drinks', 'price_L', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('drinks', 'price_M')
    queryInterface.removeColumn('drinks', 'price_L')
  }
}
