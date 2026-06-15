import { Router } from 'express';
import { LocationController } from '../../../controllers/user/location/location.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildLocationRoutes(controller: LocationController) {
  const router = Router();
  router.post('/', authenticate, asyncHandler(controller.updateLocation));
  router.get('/', authenticate, asyncHandler(controller.getLocation));
  router.post('/reverse-geocode', asyncHandler(controller.reverseGeoCode));
  return router;
}
