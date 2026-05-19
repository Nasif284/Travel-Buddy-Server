import Redis from 'ioredis';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../services';
import { BuildAdminRepositories } from './admin.reposetories';
import { BuildAdminUseCases } from './admin.usecases';
import { AdminAuthController } from '../../../presentation/controllers/admin/auth/admin.auth.controller';
import { UserManagementController } from '../../../presentation/controllers/admin/user-management/user-management.controller';
import { PrismaClient } from '@prisma/client';

export function BuildAdminContainer(db: PrismaClient, redis: Redis) {
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();
  const sessionService = new RedisSessionService(redis);

  const adminRepositories = BuildAdminRepositories(db);

  const adminUseCases = BuildAdminUseCases(
    adminRepositories.adminRepository,
    adminRepositories.userRepository,
    tokenService,
    sessionService,
    hashService,
  );

  const adminAuthController = new AdminAuthController(
    adminUseCases.adminLoginUseCase,
    adminUseCases.createAdmin,
    adminUseCases.logout,
    adminUseCases.refreshToken,
  );

  const userManagementController = new UserManagementController(
    adminUseCases.getAllUsers,
  );

  return { adminAuthController, userManagementController };
}
