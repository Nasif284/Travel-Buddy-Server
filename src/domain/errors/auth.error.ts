import { HttpStatus } from '../enums/HttpStatusCodes.constants';
import { AppError } from '../../presentation/Errors/app.error';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'INVALID_CREDENTIALS',
      'Email or password is incorrect.',
    );
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super(
      HttpStatus.CONFLICT,
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists.',
    );
  }
}

export class PhoneAlreadyExistsError extends AppError {
  constructor() {
    super(
      HttpStatus.CONFLICT,
      'PHONE_ALREADY_EXISTS',
      'An account with this phone number already exists.',
    );
  }
}

export class InvalidOtpError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'INVALID_OTP',
      'The OTP entered is incorrect or has expired.',
    );
  }
}

export class OtpMaxAttemptsError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'OTP_MAX_ATTEMPTS',
      'Too many incorrect attempts. Please request a new OTP.',
    );
  }
}

export class OtpNotFoundError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'OTP_NOT_FOUND',
      'No active OTP found. Please request a new one.',
    );
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'INVALID_REFRESH_TOKEN',
      'Session expired. Please log in again.',
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Access token is missing or invalid.') {
    super(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', message);
  }
}

export class AccountSuspendedError extends AppError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      'ACCOUNT_SUSPENDED',
      'Your account has been suspended. Please contact support.',
    );
  }
}

export class AccountBannedError extends AppError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      'ACCOUNT_BANNED',
      'Your account has been permanently banned.',
    );
  }
}

export class IncorrectPasswordError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'INCORRECT_PASSWORD',
      'The current password you entered is incorrect.',
    );
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND', 'User not found.');
  }
}
