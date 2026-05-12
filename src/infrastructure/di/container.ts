import { Redis } from 'ioredis';
import { AuthController } from '../../presentation/controllers/user/auth/auth.controller';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { AdminAuthController } from '../../presentation/controllers/admin/auth/admin.auth.controller';

import { BuildUserContainer } from './user/user.container';
import { BuildAdminContainer } from './admin/admin.container';
import { UserManagementController } from '../../presentation/controllers/admin/user-management/user-management.controller';

export interface AppContainer {
  authController: AuthController;
  adminAuthController: AdminAuthController;
  userManagementController: UserManagementController;
}

export function buildContainer(
  db: NodePgDatabase<typeof schema>,
  redis: Redis,
): AppContainer {
  const { adminAuthController, userManagementController } = BuildAdminContainer(
    db,
    redis,
  );
  const { authController } = BuildUserContainer(db, redis);
  return { authController, adminAuthController, userManagementController };
}
