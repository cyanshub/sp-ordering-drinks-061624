# Ordering Drinks
Ordering Drinks 是一個基於 MVC 架構的網路應用程式, 允許使用者在線上揪團訂飲料。使用者可以選擇店家、點選飲料並進行購買。透過 gmail 寄發顯示訂單內容的系統信件, 提醒使用者購買的品項。

## 功能

### 前台功能

- **選擇店家**: 使用者可以在前台選擇要購買飲料的店家。
- **點選飲料**: 在個別店家頁面, 使用者可以選擇飲料的品項與規格。
- **購物車**: 使用者確認購買的品項與規格, 並在購物車頁面進行確認。
- **訂單成立**: 訂單成立後, 應用程式會自動寄送訂單資訊到使用者的 email, 提醒購買的飲料與規格。
- **訂單查詢**: 使用者可以在前台查詢自己的訂單資訊。

### 後台功能

- **店家管理**: 後台具有店家的增、刪、改、查功能。
- **飲料管理**: 在單一店家頁面, 店家可以新增或移除販賣的飲料。
- **訂單管理**: root 管理員可以查看所有訂單資訊並進行移除操作。

## 安裝與運行

### 環境需求

- Node.js ^14.x
- MySQL

### 安裝步驟

1. Clone 專案
    ```bash
    git clone https://github.com/你的帳號/ordering-drinks.git
    cd ordering-drinks
    ```

2. 安裝依賴
    ```bash
    npm install
    ```

3. 設置環境變數
    在專案根目錄創建 `.env` 文件, 並設定以下變數：
    ```env
    SESSION_SECRET=your_session_secret
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ```

4. 建立資料庫
    使用 Sequelize CLI 進行資料庫遷移
    ```bash
    npx sequelize db:migrate
    ```

5. 啟動伺服器
    ```bash
    npm run start
    ```
    或使用 nodemon 進行開發
    ```bash
    npm run dev
    ```

## 專案結構
ordering-drinks/
```markdown
.
├── config/
├── controllers/
├── migrations/
├── models/
├── public/
├── routes/
├── seeders/
├── views/
├── .env.example
├── app.js
├── package.json
└── README.md
```


## 主要技術
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Nodemailer](https://nodemailer.com/)




