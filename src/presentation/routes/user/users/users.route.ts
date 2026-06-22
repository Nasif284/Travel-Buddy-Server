import { Router } from 'express';
import { UsersController } from '../../../controllers/user/users/users.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildUsersRoute(controller: UsersController) {
  const router = Router();
  router.get('/cards', authenticate, asyncHandler(controller.getUsersForCard));
  router.get('/nearby', authenticate, asyncHandler(controller.getNearbyUsers));
  router.get('/me', authenticate, asyncHandler(controller.getMe));
  router.get('/:id', authenticate, asyncHandler(controller.getUserProfile));

  return router;
}
