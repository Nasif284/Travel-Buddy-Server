import { Router } from 'express';
import { ChatController } from '../../../controllers/user/chat/chat.controller';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildChatRoutes(
  controller: ChatController,
  auth: UserAuthMiddleware,
): Router {
  const router = Router();
  router.get(
    '/conversations',
    auth.authenticate,
    asyncHandler(controller.getDirectConversations),
  );

  router.get(
    '/direct/:userId',
    auth.authenticate,
    asyncHandler(controller.getDirectChat),
  );

  router.get(
    '/group/:groupId',
    auth.authenticate,
    asyncHandler(controller.getGroupChat),
  );

  router.post(
    '/:conversationId/messages',
    auth.authenticate,
    asyncHandler(controller.sendMessage),
  );

  router.get(
    '/:conversationId/messages',
    auth.authenticate,
    asyncHandler(controller.getMessages),
  );

  return router;
}
