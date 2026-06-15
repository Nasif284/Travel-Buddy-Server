import { container } from 'tsyringe';
import { AuthController } from '../../presentation/controllers/user/auth/auth.controller';
import { AdminAuthController } from '../../presentation/controllers/admin/auth/admin.auth.controller';
import { UserManagementController } from '../../presentation/controllers/admin/user-management/user-management.controller';
import { registerDependencies } from './dependency-regestration';
import { PrismaClient } from '@prisma/client/extension';
import Redis from 'ioredis';
import { OnboardingController } from '../../presentation/controllers/user/onboarding/onboarding.controller';
import { LookupController } from '../../presentation/controllers/lookup/lookup.controller';
import { LocationController } from '../../presentation/controllers/user/location/location.controller';
import { UsersController } from '../../presentation/controllers/user/users/users.controller';
export interface AppContainer {
  authController: AuthController;
  adminAuthController: AdminAuthController;
  userManagementController: UserManagementController;
  onboardingController: OnboardingController;
  lookupController: LookupController;
  locationController: LocationController;
  usersController: UsersController;
}

export function buildContainer(db: PrismaClient, redis: Redis) {
  registerDependencies(db, redis);
  const authController = container.resolve(AuthController);
  const adminAuthController = container.resolve(AdminAuthController);
  const userManagementController = container.resolve(UserManagementController);
  const onboardingController = container.resolve(OnboardingController);
  const lookupController = container.resolve(LookupController);
  const locationController = container.resolve(LocationController);
  const usersController = container.resolve(UsersController);
  return {
    authController,
    adminAuthController,
    userManagementController,
    onboardingController,
    lookupController,
    locationController,
    usersController,
  };
}
