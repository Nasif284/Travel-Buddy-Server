import { Router } from 'express';
import { buildAdminAuthRoutes } from './auth/auth.route';
import { AdminControllers } from '../../../infrastructure/di/container';
import { buildUserManagementRoutes } from './user-management/user-management.route';
import { buildTripsManagementRoutes } from './trip-management/trip-management.route';

export function buildAdminRoutes(container: AdminControllers): Router {
  const router = Router();
  router.use('/auth', buildAdminAuthRoutes(container.adminAuthController));
  router.use(
    '/users',
    buildUserManagementRoutes(container.userManagementController),
  );
  router.use(
    '/trips',
    buildTripsManagementRoutes(container.tripManagementController),
  );
  return router;
}
