import { Router } from 'express';
import { OnboardingController } from '../../../controllers/user/onboarding/onboarding.controller';
import { validate } from '../../../validators/validator';
import { onboardingSourceSchema } from '../../../validators/user/onboarding/source.validator';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { upload } from '../../../middleware/storage/multer.middleware';
import { TravelStyleSchema } from '../../../validators/user/onboarding/travel-style.validator';

export function buildOnboardingRoutes(
  controller: OnboardingController,
): Router {
  const router = Router();
  router.post(
    '/source',
    authenticate,
    validate(onboardingSourceSchema),
    asyncHandler(controller.addOnboardingSource),
  );
  router.post(
    '/profile',
    authenticate,
    upload.fields([
      {
        name: 'image',
        maxCount: 1,
      },
      {
        name: 'coverImage',
        maxCount: 1,
      },
    ]),
    asyncHandler(controller.setUserProfile),
  );
  router.post(
    '/travel-style',
    authenticate,
    validate(TravelStyleSchema),
    asyncHandler(controller.setTravelStyle),
  );
  router.patch(
    '/profile',
    authenticate,
    asyncHandler(controller.editOnboardingProfile),
  );
  router.patch(
    '/travel-style',
    authenticate,
    validate(TravelStyleSchema),
    asyncHandler(controller.editTravelStyle),
  );
  return router;
}
