import { Router } from 'express';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import buildGroupMembersRoutes from './members/members.route';
import { buildChecklistRoutes } from './checklist/checklist.route';
import { TripControllers } from '../../../../infrastructure/di/container';
import { buildExpenseRoutes } from './expense/expense.route';

export function buildTripGroupRoutes(controllers: TripControllers): Router {
  const router = Router();
  const controller = controllers.tripController;

  router.use('/:id/members', buildGroupMembersRoutes(controller));
  router.use(
    '/:id/checklist',
    buildChecklistRoutes(controllers.checklistController),
  );
  router.use('/:id/expense', buildExpenseRoutes(controllers.expenseController));

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
