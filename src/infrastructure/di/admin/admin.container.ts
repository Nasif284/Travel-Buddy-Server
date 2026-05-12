import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import Redis from 'ioredis';
import * as schema from '../../database/schema';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../services';
import { BuildAdminRepositories } from './admin.reposetories';
import { BuildAdminUseCases } from './admin.usecases';
import { AdminAuthController } from '../../../presentation/controllers/admin/auth/admin.auth.controller';
import { UserManagementController } from '../../../presentation/controllers/admin/user-management/user-management.controller';

export function BuildAdminContainer(
  db: NodePgDatabase<typeof schema>,
  redis: Redis,
) {
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
