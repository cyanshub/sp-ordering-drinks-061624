'use strict'
const axios = require('axios')
const { shuffleFisherYates, filterUnique } = require('../helpers/array-helpers')
const urlMale = 'https://randomuser.me/api/?gender=male&results=50'
const urlFemale = 'https://randomuser.me/api/?gender=female&results=50'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取得網頁素材人像圖片
    const results = await Promise.all([axios.get(urlMale), axios.get(urlFemale)])
      .then(([responseMale, responseFemale]) => {
        let results = [...responseMale.data.results, ...responseFemale.data.results]

        // 使用重複值過濾演算法: 過濾掉重複的 result.picture.large
        results = filterUnique(results, ['picture', 'large'])

        // 使用 Fisher-Yates 洗牌演算法
        results = shuffleFisherYates(results)
        return results
      })
      .catch(err => console.log(err))

    // 獲取所有的 users id
    const users = await queryInterface.sequelize.query(
      'SELECT id, name FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    )

    // 加入avater: 遍歷每個 user 並更新 avatar
    for (let i = 1; i < users.length; i++) {
      // 更新 users 資料表
      await queryInterface.sequelize.query(
        'UPDATE users SET avatar = :avatar WHERE id = :id',
        { replacements: { avatar: results[i].picture.large, id: users[i].id } })

      console.log('更新使用者', users[i].name, '使用圖像:', results[i].picture.large)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('users', {
      avatar: null
    })
  }
}
