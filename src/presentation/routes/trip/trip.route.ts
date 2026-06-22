import { Router } from 'express';
import { TripController } from '../../controllers/trip/trip.controller';
import { authenticate } from '../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../middleware/error/asyncHandler';

export function buildTripRoutes(controller: TripController): Router {
  const router = Router();
  router.post('/', authenticate, asyncHandler(controller.createTrip));
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

  return router;
}
