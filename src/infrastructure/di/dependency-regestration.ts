import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

import { TOKENS } from './tokens';

import { UserRepository } from '../database/repositories/user.repository';
import { EmailService } from '../services/email.service';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../services';
import { RedisOtpService } from '../services/redisOtp.service';
import { AdminRepository } from '../database/repositories/admin.respository';
import { registerUserAuthDependencies } from './user/auth.dependency';
import { registerAdminAuthDependencies } from './admin/auth.dependency';
import { registerUsersManagementDependencies } from './admin/user-management.dependency';

export function registerDependencies(db: PrismaClient, redis: Redis): void {
  container.registerInstance<PrismaClient>(TOKENS.PrismaClient, db);
  container.registerInstance<Redis>(TOKENS.RedisClient, redis);

  container.registerSingleton<BcryptHashService>(
    TOKENS.IHashService,
    BcryptHashService,
  );
  container.registerSingleton<JwtTokenService>(
    TOKENS.ITokenService,
    JwtTokenService,
  );
  container.registerSingleton<RedisSessionService>(
    TOKENS.ISessionService,
    RedisSessionService,
  );

  container.registerSingleton<RedisOtpService>(
    TOKENS.IOtpService,
    RedisOtpService,
  );
  container.registerSingleton<EmailService>(TOKENS.IEmailService, EmailService);

  container.registerSingleton<UserRepository>(
    TOKENS.IUserRepository,
    UserRepository,
  );
  container.registerSingleton<AdminRepository>(
    TOKENS.IAdminRepository,
    AdminRepository,
  );

  //use-cases injection
  registerUserAuthDependencies();
  registerAdminAuthDependencies();
  registerUsersManagementDependencies();
}
