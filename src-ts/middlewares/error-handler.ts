import { Request, Response, NextFunction } from 'express'

// 定義資料型別
interface CustomError extends Error {
  status?: number
}

const generalErrorHandler = (err: Error | string, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    req.flash('error_messages', `${err.name}: ${err.message}`)
  } else {
    req.flash('error_messages', `${err}`)
  }
  res.redirect('back')
  next(err)
}

const apiErrorHandler = (err: CustomError | string, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(err.status || 500).json({
      status: 'error',
      message: `${err.name}: ${err.message}`
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: `${err}`
    })
  }
  next(err)
}

export { generalErrorHandler, apiErrorHandler }
