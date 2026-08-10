import { Router } from 'express';
import { ConnectionsController } from '../../../controllers/user/connections/connection.controller';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildConnectionRoutes(
  controller: ConnectionsController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router();
  router.get(
    '/',
    userAuth.authenticate,
    asyncHandler(controller.getConnections),
  );
  router.post(
    '/',
    userAuth.authenticate,
    asyncHandler(controller.sendConnectionRequest),
  );
  router.get(
    '/requests/incoming',
    userAuth.authenticate,
    asyncHandler(controller.getIncomingRequests),
  );
  router.get(
    '/requests/sent',
    userAuth.authenticate,
    asyncHandler(controller.getSentRequests),
  );
  router.get(
    '/requests',
    userAuth.authenticate,
    asyncHandler(controller.getAllRequests),
  );
  router.patch(
    '/accept/:id',
    userAuth.authenticate,
    asyncHandler(controller.acceptRequest),
  );
  router.patch(
    '/reject/:id',
    userAuth.authenticate,
    asyncHandler(controller.rejectRequest),
  );
  router.patch(
    '/withdraw/:id',
    userAuth.authenticate,
    asyncHandler(controller.withdrawRequest),
  );
  router.patch(
    '/disconnect/:id',
    userAuth.authenticate,
    asyncHandler(controller.disconnect),
  );
  return router;
}
