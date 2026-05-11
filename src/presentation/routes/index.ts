import { Router } from 'express';
import { AppContainer } from '../../infrastructure/di/container';
import { buildAuthRoutes } from './user/auth/auth.route';

export function buildRoutes(container: AppContainer): Router {
  const router = Router();
  router.use('/auth', buildAuthRoutes(container.authController));
  router.use('/onboarding', buildAuthRoutes(container.authController));
  return router;
}
