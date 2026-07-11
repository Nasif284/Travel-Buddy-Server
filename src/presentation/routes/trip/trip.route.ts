import { Router } from 'express';
import { TripController } from '../../controllers/trip/trip.controller';
import { authenticate } from '../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../middleware/error/asyncHandler';
import { buildTripGroupRoutes } from './group/group.route';

export function buildTripRoutes(controller: TripController): Router {
  const router = Router();

  router.use('/group', buildTripGroupRoutes(controller));

  router.post('/', authenticate, asyncHandler(controller.createTrip));
  router.patch('/:id', authenticate, asyncHandler(controller.editTrip));
  router.patch(
    '/delete/:id',
    authenticate,
    asyncHandler(controller.deleteTrip),
  );
  router.get(
    '/matches/:tripId',
    authenticate,
    asyncHandler(controller.getTripMatches),
  );
  router.get(
    '/matches/profile/:matchId',
    authenticate,
    asyncHandler(controller.getMatchProfile),
  );
  router.get('/active', authenticate, asyncHandler(controller.getActiveTrip));

  router.get('/upcoming', authenticate, asyncHandler(controller.getUserTrips));
  router.get('/upcoming/:id', asyncHandler(controller.getUpcomingTrip));
  router.get('/past', authenticate, asyncHandler(controller.getUserPastTrip));
  router.get('/past/:id', asyncHandler(controller.getPastTrip));

  return router;
}
