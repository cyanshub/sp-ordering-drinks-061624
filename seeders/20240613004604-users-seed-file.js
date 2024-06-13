'use strict'
const counts = 3 // 生成用戶數量
const bcrypt = require('bcryptjs')

// 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = 10 // 產生加鹽密碼
    const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, salt)

    // 建立 root 使用者
    await queryInterface.bulkInsert('users', [{
      name: 'root',
      email: 'root@example.com',
      password: hashedPassword,
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }])

    // 建立使用者
    await queryInterface.bulkInsert('users',
      Array.from({ length: counts }, (_, index) => ({
        name: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: hashedPassword,
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null)
  }
}
