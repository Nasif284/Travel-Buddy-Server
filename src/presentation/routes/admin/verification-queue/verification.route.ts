import { Router } from 'express';
import { VerificationQueueController } from '../../../controllers/admin/verification-queue/verification.controller';
import { AdminAuthMiddleware } from '../../../middleware/user/auth/adminAuthMiddleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';

export function buildVerificationsRoute(
  controller: VerificationQueueController,
  adminAuth: AdminAuthMiddleware,
): Router {
  const router = Router();
  router.get(
    '/:verificationId',
    adminAuth.authenticate,
    asyncHandler(controller.getVerificationDetails),
  );
  router.get(
    '/',
    adminAuth.authenticate,
    asyncHandler(controller.getVerificationQueue),
  );
  router.post(
    '/:id/approve',
    adminAuth.authenticate,
    asyncHandler(controller.approveVerification),
  );
  router.post(
    '/:id/reject',
    adminAuth.authenticate,
    asyncHandler(controller.rejectVerification),
  );
  router.post(
    '/:id/resubmission',
    adminAuth.authenticate,
    asyncHandler(controller.requestResubmission),
  );
  return router;
}
