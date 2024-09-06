// src-ts/typings/express.d.ts
import express from 'express';
import { UserData } from './user-services';


// 假設你有一個 User 型別，或者你可以根據需求自訂 user 型別
// UserAuth 就會繼承 UserData 的所有屬性，並且你可以直接使用它作為 req.user 的型別
interface UserAuth extends UserData {}

declare global {
  namespace Express {
    interface Request {
      flash(message: string): void;
      flash(type: string, message: string): void;
      user?: UserAuth; // 擴展 req.user
      file?: Express.Multer.File; // 單個文件的情況
      files?: Express.Multer.File[]; // 多文件上傳時
    }
  }
}