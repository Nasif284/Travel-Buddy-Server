import { Router } from 'express';
import { UserAuthMiddleware } from '../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../middleware/error/asyncHandler';
import { buildTripGroupRoutes } from './group/group.route';
import { TripControllers } from '../../../infrastructure/di/container';

export function buildTripRoutes(
  controllers: TripControllers,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router();
  const controller = controllers.tripController;
  router.use('/group', buildTripGroupRoutes(controllers, userAuth));

  router.post('/', userAuth.authenticate, asyncHandler(controller.createTrip));
  router.patch(
    '/:id',
    userAuth.authenticate,
    asyncHandler(controller.editTrip),
  );
  router.patch(
    '/delete/:id',
    userAuth.authenticate,
    asyncHandler(controller.deleteTrip),
  );
  router.get(
    '/matches/:tripId',
    userAuth.authenticate,
    asyncHandler(controller.getTripMatches),
  );
  router.get(
    '/matches/profile/:matchId',
    userAuth.authenticate,
    asyncHandler(controller.getMatchProfile),
  );
  router.get(
    '/active',
    userAuth.authenticate,
    asyncHandler(controller.getActiveTrip),
  );

  router.get(
    '/upcoming',
    userAuth.authenticate,
    asyncHandler(controller.getUserTrips),
  );
  router.get('/upcoming/:id', asyncHandler(controller.getUpcomingTrip));
  router.get(
    '/past',
    userAuth.authenticate,
    asyncHandler(controller.getUserPastTrip),
  );
  router.get('/past/:id', asyncHandler(controller.getPastTrip));

  return router;
}
