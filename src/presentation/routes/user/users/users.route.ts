import { Router } from 'express';
import { UsersController } from '../../../controllers/user/users/users.controller';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildUsersRoute(
  controller: UsersController,
  userAuth: UserAuthMiddleware,
) {
  const router = Router();
  router.get(
    '/cards',
    userAuth.authenticate,
    asyncHandler(controller.getUsersForCard),
  );
  router.get(
    '/nearby',
    userAuth.authenticate,
    asyncHandler(controller.getNearbyUsers),
  );
  router.get('/me', userAuth.authenticate, asyncHandler(controller.getMe));
  router.get(
    '/:id',
    userAuth.authenticate,
    asyncHandler(controller.getUserProfile),
  );

  return router;
}
