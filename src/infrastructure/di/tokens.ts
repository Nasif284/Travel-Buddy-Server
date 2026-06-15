import { ADMIN_TOKENS } from './admin/admin.tokens';
import { LOOKUP_TOKENS } from './lookup/lookup.tokens';
import { USER_TOKENS } from './user/user.tokens';

export const TOKENS = {
  IUserRepository: 'IUserRepository',
  IAdminRepository: 'IAdminRepository',
  ILookupRepository: 'ILookupRepository',

  IHashService: 'IHashService',
  ITokenService: 'ITokenService',
  ISessionService: 'ISessionService',
  IOtpService: 'IOtpService',
  IEmailService: 'IEmailService',
  IStorageService: 'IStorageService',
  IGeocodeService: 'IGeocodeService',

  PrismaClient: 'PrismaClient',
  RedisClient: 'RedisClient',

  ...USER_TOKENS,
  ...ADMIN_TOKENS,
  ...LOOKUP_TOKENS,
} as const;
