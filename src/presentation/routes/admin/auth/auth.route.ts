import { Router } from 'express';
import { AdminAuthController } from '../../../controllers/admin/auth/admin.auth.controller';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildAdminAuthRoutes(controller: AdminAuthController): Router {
  const router = Router();
  router.post('/create', asyncHandler(controller.create));
  router.post('/login', asyncHandler(controller.login));
  router.post('/logout', asyncHandler(controller.logout));
  router.post('/refresh', asyncHandler(controller.refreshToken));
  return router;
}
