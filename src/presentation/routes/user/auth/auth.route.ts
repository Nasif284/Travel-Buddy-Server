import { Router } from 'express';
import { AuthController } from '../../../controllers/user/auth/auth.controller';
import { RegisterSchema, validate } from '../../../validators/user/auth';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { VerifyEmailSchema } from '../../../validators/user/auth/verify-email.validator';
import { LoginSchema } from '../../../validators/user/auth/login.validator';
import { buildPasswordRoutes } from './password/password.route';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';

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
    validate(VerifyEmailSchema),
    asyncHandler(controller.verifyEmail),
  );
  router.post('/send-otp', asyncHandler(controller.sendOtp));
  router.post('/verify-otp', asyncHandler(controller.verifyOtp));
  router.post('/login', validate(LoginSchema), asyncHandler(controller.login));
  router.post('/google', asyncHandler(controller.googleAuth));
  router.post('/refresh', asyncHandler(controller.refreshToken));
  router.post('/logout', authenticate, asyncHandler(controller.logout));
  router.get('/me', authenticate, asyncHandler(controller.authMe));
  return router;
}
