import { Router } from 'express';
import { TripManagementController } from '../../../controllers/admin/trip-management/trips-management.controller';

import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { authenticateAdmin } from '../../../middleware/user/auth/adminAuthMiddleware';

export function buildTripsManagementRoutes(
  controller: TripManagementController,
): Router {
  const router = Router();
  router.get('/:id', authenticateAdmin, asyncHandler(controller.getGroup));
  router.get('/', authenticateAdmin, asyncHandler(controller.getAllTripGroups));

  return router;
}
