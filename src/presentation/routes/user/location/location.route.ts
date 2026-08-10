import { Router } from 'express';
import { LocationController } from '../../../controllers/user/location/location.controller';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildLocationRoutes(
  controller: LocationController,
  userAuth: UserAuthMiddleware,
) {
  const router = Router();
  router.post(
    '/',
    userAuth.authenticate,
    asyncHandler(controller.updateLocation),
  );
  router.get('/', userAuth.authenticate, asyncHandler(controller.getLocation));
  router.post('/reverse-geocode', asyncHandler(controller.reverseGeoCode));
  return router;
}
