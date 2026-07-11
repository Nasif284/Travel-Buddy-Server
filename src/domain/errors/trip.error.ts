import { AppError } from '../../presentation/Errors/app.error';
import { TRIP_ERROR_CODES } from '../../shared/constants/error-codes/trip.code';
import { TRIP_ERROR_MESSAGES } from '../../shared/constants/messages/error/trip.messages';
import { HttpStatus } from '../enums/HttpStatusCodes.constants';

export class GroupNotFound extends AppError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      TRIP_ERROR_CODES.GROUP_NOT_FOUND,
      TRIP_ERROR_MESSAGES.GROUP_NOT_FOUND,
    );
  }
}

export class UserAlreadyExistInTheGroupError extends AppError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      TRIP_ERROR_CODES.USER_ALREADY_IN_THE_GROUP,
      TRIP_ERROR_MESSAGES.USER_ALREADY_IN_THE_GROUP,
    );
  }
}

export class OnlyAdminCanRemoveError extends AppError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      TRIP_ERROR_CODES.ONLY_ADMIN_CAN_REMOVE,
      TRIP_ERROR_MESSAGES.ONLY_ADMIN_CAN_REMOVE,
    );
  }
}
