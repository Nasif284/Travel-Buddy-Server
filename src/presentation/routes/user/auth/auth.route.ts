import { Router } from 'express';
import { AuthController } from '../../../controllers/user/auth/auth.controller';
import { RegisterSchema, validate } from '../../../validators/user/auth';
import { asyncHandler } from '../../../middleware/asyncHandler';
import { VerifyOtpSchema } from '../../../validators/user/auth/verify-otp.validator';
import { LoginSchema } from '../../../validators/user/auth/login.validator';
import { ForgotPasswordSchema } from '../../../validators/user/auth/forgot-password.validator';
import { ResetPasswordSchema } from '../../../validators/user/auth/reset-password.validator';
import { buildPasswordRoutes } from './password/password.route';

export function buildAuthRoutes(controller: AuthController): Router {
  const router = Router();
  router.use('/password', buildPasswordRoutes(controller));
  router.post(
    '/register',
    validate(RegisterSchema),
    asyncHandler(controller.register),
  );
  router.post(
    '/verify',
    validate(VerifyOtpSchema),
    asyncHandler(controller.verifyEmail),
  );
  router.post('/login', validate(LoginSchema), asyncHandler(controller.login));
  router.post(
    '/password/forgot',
    validate(ForgotPasswordSchema),
    asyncHandler(controller.forgotPassword),
  );
  router.post(
    '/password/forgot/reset',
    validate(ResetPasswordSchema),
    asyncHandler(controller.resetPassword),
  );
  return router;
}
