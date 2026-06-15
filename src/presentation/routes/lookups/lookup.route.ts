import { Router } from 'express';
import { LookupController } from '../../controllers/lookup/lookup.controller';
import { asyncHandler } from '../../middleware/error/asyncHandler';

export function buildLookupRoutes(controller: LookupController): Router {
  const router = Router();
  router.get('/countries', asyncHandler(controller.getAllCountries));
  return router;
}
