import { Router } from 'express';
import { AppContainer } from '../../infrastructure/di/container';
import { buildAuthRoutes } from './user/auth/auth.route';
import { buildAdminAuthRoutes } from './admin/auth/auth.route';

export function buildRoutes(container: AppContainer): Router {
  const router = Router();
  router.use('/auth', buildAuthRoutes(container.authController));
  router.use('/onboarding', buildAuthRoutes(container.authController));
  router.use('/admin', buildAdminAuthRoutes(container.adminAuthController));
  return router;
}
