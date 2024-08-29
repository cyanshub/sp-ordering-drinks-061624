declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET: string
    // 如果有其他環境變數，也可以在這裡定義
  }
}
