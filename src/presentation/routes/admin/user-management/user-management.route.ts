import { Router } from 'express';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { UserManagementController } from '../../../controllers/admin/user-management/user-management.controller';
import { validate } from '../../../validators/user/auth';
import { ChangeStatusSchema } from '../../../validators/user-management/change-status.validator';
import { authenticateAdmin } from '../../../middleware/user/auth/adminAuthMiddleware';

export function buildUserManagementRoutes(
  controller: UserManagementController,
): Router {
  const router = Router();
  router.get(
    '/:id',
    authenticateAdmin,
    asyncHandler(controller.getUserProfile),
  );
  router.get(
    '/:id/groups',
    authenticateAdmin,
    asyncHandler(controller.getUserGroups),
  );
  router.get('/', authenticateAdmin, asyncHandler(controller.getAllUsers));
  router.patch(
    '/status',
    authenticateAdmin,
    validate(ChangeStatusSchema),
    asyncHandler(controller.changeUserStatus),
  );
  return router;
}
