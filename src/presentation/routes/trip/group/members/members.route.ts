import { Router } from 'express';
import { TripController } from '../../../../controllers/trip/trip.controller';
import { UserAuthMiddleware } from '../../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../../middleware/error/asyncHandler';

export default function buildGroupMembersRoutes(
  controller: TripController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router({ mergeParams: true });
  router.post('/', userAuth.authenticate, asyncHandler(controller.addMembers));
  router.get('/', userAuth.authenticate, asyncHandler(controller.getMembers));
  router.patch(
    '/remove/:memberId',
    userAuth.authenticate,
    asyncHandler(controller.removeMember),
  );
  router.patch(
    '/leave',
    userAuth.authenticate,
    asyncHandler(controller.leaveGroup),
  );
  router.patch(
    '/role/:memberId',
    userAuth.authenticate,
    asyncHandler(controller.changeRole),
  );
  return router;
}
