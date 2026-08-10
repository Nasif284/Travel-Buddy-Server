import { Router } from 'express';
import { AdminsController } from '../../../controllers/admin/admins/admins.controller';
import { AdminAuthMiddleware } from '../../../middleware/user/auth/adminAuthMiddleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { validate } from '../../../validators/validator';
import { UpdateAdminSchema } from '../../../validators/admin/update-admin.validator';

export function buildAdminsRoutes(
  controller: AdminsController,
  adminAuth: AdminAuthMiddleware,
): Router {
  const router = Router();
  router.get('/', adminAuth.authenticate, asyncHandler(controller.getAdmins));
  router.patch(
    '/:adminId',
    adminAuth.authenticate,
    validate(UpdateAdminSchema),
    controller.updateAdmin,
  );
  return router;
}
