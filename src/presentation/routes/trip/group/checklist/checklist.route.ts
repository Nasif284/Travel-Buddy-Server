import { Router } from 'express';
import { ChecklistController } from '../../../../controllers/trip/checklist/checklist.controller';
import { UserAuthMiddleware } from '../../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../../middleware/error/asyncHandler';

export function buildChecklistRoutes(
  controller: ChecklistController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router({ mergeParams: true });
  router.get('/', userAuth.authenticate, asyncHandler(controller.getChecklist));
  router.post('/', userAuth.authenticate, asyncHandler(controller.addTask));
  router.patch(
    '/:taskId',
    userAuth.authenticate,
    asyncHandler(controller.editTask),
  );
  router.delete(
    '/:taskId',
    userAuth.authenticate,
    asyncHandler(controller.deleteTask),
  );
  router.patch(
    '/:taskId/complete',
    userAuth.authenticate,
    asyncHandler(controller.completeTask),
  );
  return router;
}
