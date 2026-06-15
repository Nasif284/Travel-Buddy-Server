import { Router } from 'express';
import { AppContainer } from '../../infrastructure/di/container';
import { buildAuthRoutes } from './user/auth/auth.route';
import { buildAdminRoutes } from './admin';
import { buildOnboardingRoutes } from './user/onboarding/onboarding.route';
import { buildLookupRoutes } from './lookups/lookup.route';
import { buildLocationRoutes } from './user/location/location.route';
import { buildUsersRoute } from './user/users/users.route';

export function buildRoutes(container: AppContainer): Router {
  const router = Router();
  router.use('/auth', buildAuthRoutes(container.authController));
  router.use(
    '/onboarding',
    buildOnboardingRoutes(container.onboardingController),
  );
  router.use('/admin', buildAdminRoutes(container));
  router.use('/lookup', buildLookupRoutes(container.lookupController));
  router.use('/location', buildLocationRoutes(container.locationController));
  router.use('/users', buildUsersRoute(container.usersController));
  return router;
}
