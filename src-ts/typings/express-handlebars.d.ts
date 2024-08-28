declare module 'express-handlebars' {
  import { Engine } from 'express-handlebars'

  interface ExphbsOptions {
    extname?: string
    layoutsDir?: string
    partialsDir?: string | string[]
    defaultLayout?: string
    helpers?: { [key: string]: Function }
    compilerOptions?: Record<string, unknown> // 更具嚴謹性的替代
  }

  function exphbs(options?: ExphbsOptions): Engine

  export = exphbs
}
