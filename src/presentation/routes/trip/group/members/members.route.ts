import { Router } from 'express';
import { TripController } from '../../../../controllers/trip/trip.controller';
import { authenticate } from '../../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../../middleware/error/asyncHandler';

export default function buildGroupMembersRoutes(
  controller: TripController,
): Router {
  const router = Router({ mergeParams: true });
  router.post('/', authenticate, asyncHandler(controller.addMembers));
  router.get('/', authenticate, asyncHandler(controller.getMembers));
  router.patch(
    '/remove/:memberId',
    authenticate,
    asyncHandler(controller.removeMember),
  );
  router.patch('/leave', authenticate, asyncHandler(controller.leaveGroup));
  router.patch(
    '/role/:memberId',
    authenticate,
    asyncHandler(controller.changeRole),
  );
  return router;
}
