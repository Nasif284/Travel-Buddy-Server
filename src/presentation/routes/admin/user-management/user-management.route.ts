import { Router } from 'express';
import { asyncHandler } from '../../../middleware/asyncHandler';
import { UserManagementController } from '../../../controllers/admin/user-management/user-management.controller';

export function buildUserManagementRoutes(
  controller: UserManagementController,
): Router {
  const router = Router();
  router.get('/', asyncHandler(controller.getAllUsers));
  return router;
}
