import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Errors/app.error';
import { HttpStatus } from '../../domain/enums/HttpStatusCodes.constants';

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });

    return;
  }
  console.error('[Unhandled error]', err);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}
