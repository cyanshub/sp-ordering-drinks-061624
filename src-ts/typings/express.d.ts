// src-ts/typings/express.d.ts
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      flash(message: string): void;
      flash(type: string, message: string): void;
    }
  }
}