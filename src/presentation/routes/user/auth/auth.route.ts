import { Router } from 'express';
import { AuthController } from '../../../controllers/user/auth/auth.controller';
import { RegisterSchema, validate } from '../../../validators/user/auth';
import { asyncHandler } from '../../../middleware/asyncHandler';
import { VerifyOtpSchema } from '../../../validators/user/auth/verifyOtp.validator';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';

export function buildAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.post(
    '/register',
    validate(RegisterSchema),
    asyncHandler(controller.register),
  );
  router.post(
    '/verify',
    validate(VerifyOtpSchema),
    authenticate,
    asyncHandler(controller.verifyEmail),
  );

  return router;
}
