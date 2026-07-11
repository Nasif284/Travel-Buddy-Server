import { Router } from 'express';
import { TripController } from '../../../controllers/trip/trip.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import buildGroupMembersRoutes from './members/members.route';

export function buildTripGroupRoutes(controller: TripController): Router {
  const router = Router();
  router.use('/:id/members', buildGroupMembersRoutes(controller));
  router.get('/:id/invites', authenticate, asyncHandler(controller.getInvites));
  router.post(
    '/join/:inviteCode',
    authenticate,
    asyncHandler(controller.joinWithLink),
  );
  router.post('/:id', authenticate, asyncHandler(controller.createGroup));
  router.get('/active', authenticate, asyncHandler(controller.getActiveGroups));
  router.get('/:id', authenticate, asyncHandler(controller.getGroup));
  router.post(
    '/:id/invite/email',
    authenticate,
    asyncHandler(controller.sendInvite),
  );
  router.get(
    '/:id/invite/code',
    authenticate,
    asyncHandler(controller.getInviteCode),
  );
  return router;
}
