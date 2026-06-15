import { Router } from 'express';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { UserManagementController } from '../../../controllers/admin/user-management/user-management.controller';
import { validate } from '../../../validators/user/auth';
import { ChangeStatusSchema } from '../../../validators/user-management/change-status.validator';

export function buildUserManagementRoutes(
  controller: UserManagementController,
): Router {
  const router = Router();
  router.get('/', asyncHandler(controller.getAllUsers));
  router.patch(
    '/status',
    validate(ChangeStatusSchema),
    asyncHandler(controller.changeUserStatus),
  );
  return router;
}
