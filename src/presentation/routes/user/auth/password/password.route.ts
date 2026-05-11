import { Router } from 'express';
import { validate } from '../../../../validators/user/auth';
import { asyncHandler } from '../../../../middleware/asyncHandler';
import { ForgotPasswordSchema } from '../../../../validators/user/auth/forgot-password.validator';
import { ResetPasswordSchema } from '../../../../validators/user/auth/reset-password.validator';
import { AuthController } from '../../../../controllers/user/auth/auth.controller';

export function buildPasswordRoutes(controller: AuthController): Router {
  const router = Router();
  router.post(
    '/forgot',
    validate(ForgotPasswordSchema),
    asyncHandler(controller.forgotPassword),
  );
  router.post(
    '/forgot/reset',
    validate(ResetPasswordSchema),
    asyncHandler(controller.resetPassword),
  );
  return router;
}
