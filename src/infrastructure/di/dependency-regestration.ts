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
import { registerOnboardingDependency } from './user/onbaording.dependency';
import { StorageService } from '../services/storage.service';
import { LookupRepository } from '../database/repositories/lookups.repository';
import { registerLookupDependency } from './lookup/lookup.dependency';
import { registerLocationDependency } from './user/location.dependency,';
import { GoogleGeocodingService } from '../services/geocode.service';
import { registerUserDependency } from './user/user.dependency';
import { TripRepository } from '../database/repositories/trip.repository';
import { ImageService } from '../services/image.service';
import { registerTripDependency } from './trip/trip.dependency';
import { registerConnectionDependency } from './user/connection.dependency';
import { registerProfileDependency } from './user/porfile.dependency';

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
  container.registerSingleton<StorageService>(
    TOKENS.IStorageService,
    StorageService,
  );
  container.registerSingleton<GoogleGeocodingService>(
    TOKENS.IGeocodeService,
    GoogleGeocodingService,
  );
  container.registerSingleton<ImageService>(TOKENS.IImageService, ImageService);

  container.registerSingleton<UserRepository>(
    TOKENS.IUserRepository,
    UserRepository,
  );
  container.registerSingleton<AdminRepository>(
    TOKENS.IAdminRepository,
    AdminRepository,
  );
  container.registerSingleton<LookupRepository>(
    TOKENS.ILookupRepository,
    LookupRepository,
  );
  container.registerSingleton<TripRepository>(
    TOKENS.ITripRepository,
    TripRepository,
  );

  // admin use-cases injection
  registerAdminAuthDependencies();
  registerUsersManagementDependencies();
  registerLookupDependency();

  // user use-cases injection
  registerUserAuthDependencies();
  registerOnboardingDependency();
  registerLocationDependency();
  registerUserDependency();
  registerTripDependency();
  registerConnectionDependency();
  registerProfileDependency();
}
