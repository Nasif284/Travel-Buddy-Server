import { Router } from 'express';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import buildGroupMembersRoutes from './members/members.route';
import { buildChecklistRoutes } from './checklist/checklist.route';
import { TripControllers } from '../../../../infrastructure/di/container';
import { buildExpenseRoutes } from './expense/expense.route';
import { buildItineraryRoutes } from './itinerary/itenerary.route';

export function buildTripGroupRoutes(
  controllers: TripControllers,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router();
  const controller = controllers.tripController;

  router.use('/:id/members', buildGroupMembersRoutes(controller, userAuth));
  router.use(
    '/:id/checklist',
    buildChecklistRoutes(controllers.checklistController, userAuth),
  );
  router.use(
    '/:id/expenses',
    buildExpenseRoutes(controllers.expenseController, userAuth),
  );
  router.use(
    '/:id/itinerary',
    buildItineraryRoutes(controllers.itineraryController, userAuth),
  );

  router.get(
    '/:id/invites',
    userAuth.authenticate,
    asyncHandler(controller.getInvites),
  );
  router.post(
    '/join/:inviteCode',
    userAuth.authenticate,
    asyncHandler(controller.joinWithLink),
  );
  router.post(
    '/:id',
    userAuth.authenticate,
    asyncHandler(controller.createGroup),
  );
  router.get(
    '/active',
    userAuth.authenticate,
    asyncHandler(controller.getActiveGroups),
  );
  router.get('/:id', userAuth.authenticate, asyncHandler(controller.getGroup));
  router.post(
    '/:id/invite/email',
    userAuth.authenticate,
    asyncHandler(controller.sendInvite),
  );
  router.get(
    '/:id/invite/code',
    userAuth.authenticate,
    asyncHandler(controller.getInviteCode),
  );
  router.get(
    '/:id/weather',
    userAuth.authenticate,
    asyncHandler(controller.getTripWeather),
  );
  return router;
}
