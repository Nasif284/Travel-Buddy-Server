import { Router } from 'express';
import { AppContainer } from '../../infrastructure/di/dependency-regestration';
import { buildAuthRoutes } from './user/auth/auth.route';
import { buildAdminRoutes } from './admin';

export function buildRoutes(container: AppContainer): Router {
  const router = Router();
  router.use('/auth', buildAuthRoutes(container.authController));
  router.use('/onboarding', buildAuthRoutes(container.authController));
  router.use('/admin', buildAdminRoutes(container));
  return router;
}
