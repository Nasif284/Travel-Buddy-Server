import { ADMIN_TOKENS } from './admin/admin.tokens';
import { CHECKLIST_TOKENS } from './checklsit/checklist.tokens';
import { EXPENSE_TOKENS } from './expense/tokens';
import { LOOKUP_TOKENS } from './lookup/lookup.tokens';
import { TRIP_TOKENS } from './trip/tokens';
import { USER_TOKENS } from './user/user.tokens';

export const TOKENS = {
  IUserRepository: 'IUserRepository',
  IAdminRepository: 'IAdminRepository',
  ILookupRepository: 'ILookupRepository',
  IChecklistRepository: 'IChecklistRepository',
  IExpenseRepository: 'IExpenseRepository',

  IHashService: 'IHashService',
  ITokenService: 'ITokenService',
  ISessionService: 'ISessionService',
  IOtpService: 'IOtpService',
  IEmailService: 'IEmailService',
  IStorageService: 'IStorageService',
  IGeocodeService: 'IGeocodeService',
  IImageService: 'IImageService',
  IWeatherService: 'IWeatherService',
  IPhoneOtpService: 'IPhoneOtpService',
  ISmsService: 'ISmsService',

  PrismaClient: 'PrismaClient',
  RedisClient: 'RedisClient',

  ...USER_TOKENS,
  ...ADMIN_TOKENS,
  ...LOOKUP_TOKENS,
  ...TRIP_TOKENS,
  ...CHECKLIST_TOKENS,
  ...EXPENSE_TOKENS,
} as const;
