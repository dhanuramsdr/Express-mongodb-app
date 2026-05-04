import { Request, Response, NextFunction } from 'express';
import { errorInterface, ErrorWithStatus } from '../intrerface/interface';

export class HandleError extends Error implements errorInterface {
  statuscode: number;
  constructor(message: string, statuscode: number) {
    super(message);
    this.statuscode = statuscode;
    this.name = 'HandleError';
    Error.captureStackTrace(this, HandleError);
  }
}
export default (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
