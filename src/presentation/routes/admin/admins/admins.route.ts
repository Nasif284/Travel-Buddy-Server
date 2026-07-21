import { Router } from 'express';
import { AdminsController } from '../../../controllers/admin/adimins/admins.controller';
import { authenticateAdmin } from '../../../middleware/user/auth/adminAuthMiddleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildAdminsRoutes(controller: AdminsController): Router {
  const router = Router();
  router.get('/', authenticateAdmin, asyncHandler(controller.getAdmins));
  return router;
}
