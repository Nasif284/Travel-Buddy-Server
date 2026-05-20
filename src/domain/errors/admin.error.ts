import { AppError } from '../../presentation/Errors/app.error';
import { AUTH_ERROR_CODES } from '../../shared/constants/error-codes/auth.code';
import { AUTH_ERROR_MESSAGES } from '../../shared/constants/messages/error/auth.messages';
import { HttpStatus } from '../enums/HttpStatusCodes.constants';

export class AdminNotFoundError extends AppError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      AUTH_ERROR_CODES.ADMIN_NOT_FOUND,
      AUTH_ERROR_MESSAGES.ADMIN_NOT_FOUND,
    );
  }
}
