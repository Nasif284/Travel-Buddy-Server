import { Router } from 'express';
import { AdminAuthController } from '../../../controllers/admin/auth/admin.auth.controller';
import { asyncHandler } from '../../../middleware/asyncHandler';

export function buildAdminAuthRoutes(controller: AdminAuthController): Router {
  const router = Router();
  router.post('/create', asyncHandler(controller.create));
  router.post('/login', asyncHandler(controller.login));
  return router;
}
