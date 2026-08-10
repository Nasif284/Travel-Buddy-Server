import { Router } from 'express';
import { TripManagementController } from '../../../controllers/admin/trip-management/trips-management.controller';

import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { AdminAuthMiddleware } from '../../../middleware/user/auth/adminAuthMiddleware';

export function buildTripsManagementRoutes(
  controller: TripManagementController,
  adminAuth: AdminAuthMiddleware,
): Router {
  const router = Router();
  router.get('/:id', adminAuth.authenticate, asyncHandler(controller.getGroup));
  router.get(
    '/',
    adminAuth.authenticate,
    asyncHandler(controller.getAllTripGroups),
  );

  return router;
}
