import { Router } from 'express';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { UserManagementController } from '../../../controllers/admin/user-management/user-management.controller';
import { validate } from '../../../validators/user/auth';
import { ChangeStatusSchema } from '../../../validators/user-management/change-status.validator';
import { AdminAuthMiddleware } from '../../../middleware/user/auth/adminAuthMiddleware';

export function buildUserManagementRoutes(
  controller: UserManagementController,
  adminAuth: AdminAuthMiddleware,
): Router {
  const router = Router();
  router.get(
    '/:id',
    adminAuth.authenticate,
    asyncHandler(controller.getUserProfile),
  );
  router.get(
    '/:id/groups',
    adminAuth.authenticate,
    asyncHandler(controller.getUserGroups),
  );
  router.get('/', adminAuth.authenticate, asyncHandler(controller.getAllUsers));
  router.patch(
    '/status',
    adminAuth.authenticate,
    validate(ChangeStatusSchema),
    asyncHandler(controller.changeUserStatus),
  );
  return router;
}
