import { Router } from 'express';
import { buildAdminAuthRoutes } from './auth/auth.route';
import { AppContainer } from '../../../infrastructure/di/container';
import { buildUserManagementRoutes } from './user-management/user-management.route';

export function buildAdminRoutes(container: AppContainer): Router {
  const router = Router();
  router.use('/auth', buildAdminAuthRoutes(container.adminAuthController));
  router.use(
    '/users',
    buildUserManagementRoutes(container.userManagementController),
  );
  return router;
}
