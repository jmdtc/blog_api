import { Request, Response, NextFunction } from "express";

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default function (env: string):
((err: HttpException, req: Request, res: Response, next: NextFunction) => void) {
  if (env === "development") {
    return (err: HttpException, req: Request, res: Response, next: NextFunction) => {
      console.error(err)
      const status: number = err.status || 500;
      const message: string = err.message || 'Something went wrong';
      res
        .status(status)
        .json({
          message: message,
          err: err,
        })
    }
  }

  return (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    const status: number = err.status || 500;
    const message: string = err.message || 'Something went wrong';
    res
      .status(status)
      .json({
        message: message,
      })
  }
}
