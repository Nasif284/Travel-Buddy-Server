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
import { TripController } from '../../presentation/controllers/trip/trip.controller';
import { ConnectionsController } from '../../presentation/controllers/user/connections/connection.controller';
import { ProfileController } from '../../presentation/controllers/user/profile/profile.controller';
import { ChecklistController } from '../../presentation/controllers/trip/checklist/checklist.controller';
import { ExpenseController } from '../../presentation/controllers/trip/expense/expense.controller';
import { TripManagementController } from '../../presentation/controllers/admin/trip-management/trips-management.controller';
export interface AppContainer {
  adminControllers: AdminControllers;
  authController: AuthController;
  onboardingController: OnboardingController;
  lookupController: LookupController;
  locationController: LocationController;
  usersController: UsersController;
  tripControllers: TripControllers;
  connectionsController: ConnectionsController;
  profileController: ProfileController;
}

export interface TripControllers {
  tripController: TripController;
  checklistController: ChecklistController;
  expenseController: ExpenseController;
}

export interface AdminControllers {
  adminAuthController: AdminAuthController;
  userManagementController: UserManagementController;
  tripManagementController: TripManagementController;
}

export function buildContainer(db: PrismaClient, redis: Redis): AppContainer {
  registerDependencies(db, redis);
  const authController = container.resolve(AuthController);
  const adminAuthController = container.resolve(AdminAuthController);
  const userManagementController = container.resolve(UserManagementController);
  const onboardingController = container.resolve(OnboardingController);
  const lookupController = container.resolve(LookupController);
  const locationController = container.resolve(LocationController);
  const usersController = container.resolve(UsersController);
  const tripController = container.resolve(TripController);
  const connectionsController = container.resolve(ConnectionsController);
  const profileController = container.resolve(ProfileController);
  const checklistController = container.resolve(ChecklistController);
  const expenseController = container.resolve(ExpenseController);
  const tripManagementController = container.resolve(TripManagementController);
  return {
    authController,
    adminControllers: {
      adminAuthController,
      tripManagementController,
      userManagementController,
    },
    onboardingController,
    lookupController,
    locationController,
    usersController,
    tripControllers: {
      tripController,
      checklistController,
      expenseController,
    },
    connectionsController,
    profileController,
  };
}
