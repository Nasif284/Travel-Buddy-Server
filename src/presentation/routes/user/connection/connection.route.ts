import { Router } from 'express';
import { ConnectionsController } from '../../../controllers/user/connections/connection.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildConnectionRoutes(
  controller: ConnectionsController,
): Router {
  const router = Router();
  router.get('/', authenticate, asyncHandler(controller.getConnections));
  router.post(
    '/',
    authenticate,
    asyncHandler(controller.sendConnectionRequest),
  );
  router.get(
    '/requests/incoming',
    authenticate,
    asyncHandler(controller.getIncomingRequests),
  );
  router.get(
    '/requests/sent',
    authenticate,
    asyncHandler(controller.getSentRequests),
  );
  router.get(
    '/requests',
    authenticate,
    asyncHandler(controller.getAllRequests),
  );
  router.patch(
    '/accept/:id',
    authenticate,
    asyncHandler(controller.acceptRequest),
  );
  router.patch(
    '/reject/:id',
    authenticate,
    asyncHandler(controller.rejectRequest),
  );
  router.patch(
    '/withdraw/:id',
    authenticate,
    asyncHandler(controller.withdrawRequest),
  );
  router.patch(
    '/disconnect/:id',
    authenticate,
    asyncHandler(controller.disconnect),
  );
  return router;
}
