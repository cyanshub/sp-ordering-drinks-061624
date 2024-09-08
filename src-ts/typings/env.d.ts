declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: string
    JWT_SECRET: string
    GMAIL_USER: string
    GMAIL_PASS: string
    // 如果有其他環境變數，也可以在這裡定義
  }
}
