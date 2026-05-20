import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Errors/app.error';
import { HttpStatus } from '../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../responses/common-response';
import { GLOBAL_ERROR_CODE } from '../../shared/constants/error-codes/global.code';
import { GLOBAL_ERROR_MESSAGES } from '../../shared/constants/messages/error/error.messages';

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.code, err.message));

    return;
  }
  console.error('[Unhandled error]', err);
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(
      ApiResponse.error(
        GLOBAL_ERROR_CODE.SEVER_ERROR_CODE,
        GLOBAL_ERROR_MESSAGES.GLOBAL_ERROR,
      ),
    );
}
