import { ADMIN_TOKENS } from './admin/admin.tokens';
import { USER_TOKENS } from './user/user.tokens';

export const TOKENS = {
  IUserRepository: 'IUserRepository',
  IAdminRepository: 'IAdminRepository',

  IHashService: 'IHashService',
  ITokenService: 'ITokenService',
  ISessionService: 'ISessionService',
  IOtpService: 'IOtpService',
  IEmailService: 'IEmailService',

  PrismaClient: 'PrismaClient',
  RedisClient: 'RedisClient',

  ...USER_TOKENS,
  ...ADMIN_TOKENS,
} as const;
