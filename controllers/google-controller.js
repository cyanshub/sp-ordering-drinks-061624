// 載入所需工具
const nodemailer = require('nodemailer')

// 載入環境變數
require('dotenv').config()

const googleController = {
  sendEmail: (req, res, next) => {
    // 建立郵件資訊
    const emailFrom = process.env.GMAIL_USER // 用來發送信件的 Gmail
    const emailTo = req.body.emailTo // 從表單取得收件人地址
    const emailSubject = '揪團訂飲料訂單成立測試信件'
    const emailText = '為了測試系統信件發送功能, 寄出這封信件試試看!\n此郵件為系統寄送, 請勿回覆, 謝謝!'

    const mailOptions = {
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText
    }

    // 從 req.session 拿取 token
    const refreshToken = req.session.tokens.refresh_token
    const accessToken = req.session.tokens.access_token
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER, // 你要用來發送信件的 Gmail
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: refreshToken,
        accessToken: accessToken
      }
    })

    // 將郵件發送出去
    return transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        next(err)
        res.status(500).send('Error sending email')
      } else {
        console.log(info)
        req.flash('success_messages', '已建立訂單, 並成功寄出郵件!')
        res.redirect('back')
      }
    })
  }
}

module.exports = googleController
