import { Router } from 'express';
import { AuthController } from '../../../controllers/user/auth/auth.controller';
import { RegisterSchema, validate } from '../../../validators/user/auth';
import { asyncHandler } from '../../../middleware/asyncHandler';
import { VerifyOtpSchema } from '../../../validators/user/auth/verify-otp.validator';
import { LoginSchema } from '../../../validators/user/auth/login.validator';
import { ForgotPasswordSchema } from '../../../validators/user/auth/forgot-password.validator';
import { ResetPasswordSchema } from '../../../validators/user/auth/reset-password.validator';

export function buildOnboardingRoutes(controller: AuthController): Router {
  const router = Router();

  return router;
}
