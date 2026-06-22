import { AppError } from '../../presentation/Errors/app.error';
import { AUTH_ERROR_CODES } from '../../shared/constants/error-codes/auth.code';
import { USER_ERROR_CODES } from '../../shared/constants/error-codes/user.code';
import { AUTH_ERROR_MESSAGES } from '../../shared/constants/messages/error/auth.messages';
import { USER_ERROR_MESSAGES } from '../../shared/constants/messages/error/user.messages';
import { HttpStatus } from '../enums/HttpStatusCodes.constants';

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      AUTH_ERROR_CODES.USER_NOT_FOUND,
      AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
    );
  }
}
export class ImageMissingError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODES.IMAGE_MISSING,
      AUTH_ERROR_MESSAGES.IMAGE_MISSING,
    );
  }
}

export class UserLocationDataMissingError extends AppError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      USER_ERROR_CODES.LOCATION_DATA_NOT_FOUND,
      USER_ERROR_MESSAGES.LOCATION_DATA_NOT_FOUND,
    );
  }
}

export class ConnectionAlreadyExistError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      USER_ERROR_CODES.CONNECTION_ALREADY_EXIST,
      USER_ERROR_MESSAGES.CONNECTION_ALREADY_EXIST,
    );
  }
}
