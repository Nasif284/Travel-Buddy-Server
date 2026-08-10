import { Router } from 'express';
import { AiAssistantController } from '../../../controllers/user/ai-assistant/ai-assistant.controller';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildAssistantRoute(
  controller: AiAssistantController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router();
  router.post('/chat', userAuth.authenticate, asyncHandler(controller.chat));
  router.get(
    '/chats',
    userAuth.authenticate,
    asyncHandler(controller.getChats),
  );
  return router;
}
