import { Router } from 'express';
import { ChecklistController } from '../../../../controllers/trip/checklist/checklist.controller';
import { authenticate } from '../../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../../middleware/error/asyncHandler';

export function buildChecklistRoutes(controller: ChecklistController): Router {
  const router = Router({ mergeParams: true });
  router.get('/', authenticate, asyncHandler(controller.getChecklist));
  router.post('/', authenticate, asyncHandler(controller.addTask));
  router.patch('/:taskId', authenticate, asyncHandler(controller.editTask));
  router.delete('/:taskId', authenticate, asyncHandler(controller.deleteTask));
  router.patch(
    '/:taskId/complete',
    authenticate,
    asyncHandler(controller.completeTask),
  );
  return router;
}
