import { container } from 'tsyringe';
import { AuthController } from '../../presentation/controllers/user/auth/auth.controller';
import { AdminAuthController } from '../../presentation/controllers/admin/auth/admin.auth.controller';
import { UserManagementController } from '../../presentation/controllers/admin/user-management/user-management.controller';
import { registerDependencies } from './dependency-regestration';
import { PrismaClient } from '@prisma/client/extension';
import Redis from 'ioredis';
export interface AppContainer {
  authController: AuthController;
  adminAuthController: AdminAuthController;
  userManagementController: UserManagementController;
}

export function buildContainer(db: PrismaClient, redis: Redis) {
  registerDependencies(db, redis);
  const authController = container.resolve(AuthController);
  const adminAuthController = container.resolve(AdminAuthController);
  const userManagementController = container.resolve(UserManagementController);
  return { authController, adminAuthController, userManagementController };
}
