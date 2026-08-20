import { Router } from 'express';

import { AdminAnalyticsController } from '../../../controllers/admin/analytics/admin-analytics.controller';
import { AdminAuthMiddleware } from '../../../middleware/user/auth/adminAuthMiddleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildAdminAnalyticsRoutes(
  controller: AdminAnalyticsController,
  adminAuth: AdminAuthMiddleware,
): Router {
  const router = Router();

  router.get(
    '/',
    adminAuth.authenticate,
    asyncHandler(controller.getAnalytics),
  );

  return router;
}
