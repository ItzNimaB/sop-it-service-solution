import type { NextFunction, Request, Response } from "express";

declare global {
  interface IController {
    (req: Request, res: Response): void;
  }

  interface IMiddleware {
    (req: Request, res: Response, next: NextFunction): void;
  }

  interface IResponse<T = any> {
    status: number;
    data?: T;
  }
}

export {};
