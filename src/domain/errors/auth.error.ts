import { HttpStatus } from '../enums/HttpStatusCodes.constants';

import { AppError } from '../../presentation/Errors/app.error';
import { AUTH_ERROR_CODES } from '../../shared/constants/error-codes/auth.code';
import { AUTH_ERROR_MESSAGES } from '../../shared/constants/messages/error/auth.messages';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,

      AUTH_ERROR_CODES.INVALID_CREDENTIALS,

      AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
    );
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(
      HttpStatus.CONFLICT,

      AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS,

      AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
    );
  }
}

export class PhoneAlreadyExistsError extends AppError {
  constructor() {
    super(
      HttpStatus.CONFLICT,

      AUTH_ERROR_CODES.PHONE_ALREADY_EXISTS,

      AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS,
    );
  }
}

export class InvalidOtpError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,

      AUTH_ERROR_CODES.INVALID_OTP,

      AUTH_ERROR_MESSAGES.INVALID_OTP,
    );
  }
}

export class OtpMaxAttemptsError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,

      AUTH_ERROR_CODES.OTP_MAX_ATTEMPTS,

      AUTH_ERROR_MESSAGES.OTP_MAX_ATTEMPTS,
    );
  }
}

export class OtpNotFoundError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,

      AUTH_ERROR_CODES.OTP_NOT_FOUND,

      AUTH_ERROR_MESSAGES.OTP_NOT_FOUND,
    );
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,

      AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN,

      AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
    );
  }
}

export class UserNotVerifiedError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,

      AUTH_ERROR_CODES.USER_NOT_VERIFIED,

      AUTH_ERROR_MESSAGES.USER_NOT_VERIFIED,
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = AUTH_ERROR_MESSAGES.UNAUTHORIZED) {
    super(
      HttpStatus.UNAUTHORIZED,

      AUTH_ERROR_CODES.UNAUTHORIZED,

      message,
    );
  }
}

export class AccountSuspendedError extends AppError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,

      AUTH_ERROR_CODES.ACCOUNT_SUSPENDED,

      AUTH_ERROR_MESSAGES.ACCOUNT_SUSPENDED,
    );
  }
}

export class AccountBannedError extends AppError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,

      AUTH_ERROR_CODES.ACCOUNT_BANNED,

      AUTH_ERROR_MESSAGES.ACCOUNT_BANNED,
    );
  }
}

export class IncorrectPasswordError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,

      AUTH_ERROR_CODES.INCORRECT_PASSWORD,

      AUTH_ERROR_MESSAGES.INCORRECT_PASSWORD,
    );
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,

      AUTH_ERROR_CODES.USER_NOT_FOUND,

      AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
    );
  }
}

export class InvalidPhoneNumberError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODES.INVALID_PHONE_NUMBER,
      AUTH_ERROR_MESSAGES.INVALID_PHONE_NUMBER,
    );
  }
}
export class PhoneAlreadyInUseError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODES.PHONE_ALREADY_EXISTS,
      AUTH_ERROR_MESSAGES.PHONE_ALREADY_EXISTS,
    );
  }
}

export class PhoneOtpSendFailedError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      AUTH_ERROR_CODES.OTP_SENDING_FILED,
      AUTH_ERROR_MESSAGES.OTP_SENDING_FILED,
    );
  }
}
