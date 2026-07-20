import { Router } from 'express';
import { TripManagementController } from '../../../controllers/admin/trip-management/trips-management.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildTripsManagementRoutes(
  controller: TripManagementController,
): Router {
  const router = Router();
  router.get('/', authenticate, asyncHandler(controller.getAllTripGroups));
  return router;
}
