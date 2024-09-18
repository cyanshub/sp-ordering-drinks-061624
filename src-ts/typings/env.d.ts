declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: string
    JWT_SECRET: string
    GMAIL_USER: string
    GMAIL_PASS: string
    TOGGLE_RENDER_APP_ALIVE: string
    URL_SERVER_RENDER_APP: string
    TOGGLE_RENDER_APP_ALIVE_BREAK_HOUR: string
    TOGGLE_RENDER_APP_ALIVE_CONTINUE_HOUR: string
    // 如果有其他環境變數，也可以在這裡定義
  }
}
