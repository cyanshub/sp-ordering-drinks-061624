// 載入所需 npm 套件
const bcrypt = require('bcryptjs')

// 載入所需 model
const { User } = require('../models')

// 載入所需工具
const { localAvatarHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res, next) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    const Salt = 10
    if (password !== passwordCheck) throw new Error('請再次確認密碼是否輸入正確')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('使用者信箱已經存在')
        return bcrypt.hash(password, Salt)
      })
      .then(hash => {
        User.create({
          name,
          email,
          password: hash,
          isAdmin: false
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res, next) => {
    return res.render('signin')
  },
  signIn: (req, res, next) => {
    // 實際的登入功能已經由 passport 以 middlewares 的形式處理
    req.flash('success_messages', '登入成功!')
    res.redirect('/stores')
  },
  logOut: (req, res, next) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON() // 整理 user 資料
        return res.render('profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    return User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.render('edit-user', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    const { name } = req.body
    if (!name.trim()) throw new Error('需要輸入使用者名稱!')
    const file = req.file // 根據之前修正的form content, 把檔案從req取出來
    return Promise.all([
      User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      }),
      localAvatarHandler(file) // 將圖案寫入指定資料夾, 並回傳圖檔路徑
    ])
      .then(([user, filePath]) => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          avatar: filePath || user.avatar
        })
      })
      .then(updatedUser => {
        req.flash('success_messages', '已變更成功!')
        res.redirect(`/users/${updatedUser.id}`)
        return { user: updatedUser }
      })
      .catch(err => next(err))
  },
  getAvatar: (req, res, next) => {
    const userId = req.params.userId
    return User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          avatar: null
        })
      })
      .then(updatedUser => {
        req.flash('success_messages', '成功移除頭像!')
        res.redirect('back')
        return { user: updatedUser }
      })
      .catch(err => next(err))
  }
}

module.exports = userController
