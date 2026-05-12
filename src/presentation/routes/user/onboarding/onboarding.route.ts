import { Router } from 'express';
import { AuthController } from '../../../controllers/user/auth/auth.controller';

export function buildOnboardingRoutes(controller: AuthController): Router {
  const router = Router();
  return router;
}
