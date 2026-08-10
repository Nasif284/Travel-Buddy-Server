import { Router } from 'express';
import { OnboardingController } from '../../../controllers/user/onboarding/onboarding.controller';
import { validate } from '../../../validators/validator';
import { onboardingSourceSchema } from '../../../validators/user/onboarding/source.validator';
import { UserAuthMiddleware } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { upload } from '../../../middleware/storage/multer.middleware';
import { TravelStyleSchema } from '../../../validators/user/onboarding/travel-style.validator';

export function buildOnboardingRoutes(
  controller: OnboardingController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router();
  router.post(
    '/source',
    userAuth.authenticate,
    validate(onboardingSourceSchema),
    asyncHandler(controller.addOnboardingSource),
  );
  router.post(
    '/profile',
    userAuth.authenticate,
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
    userAuth.authenticate,
    validate(TravelStyleSchema),
    asyncHandler(controller.setTravelStyle),
  );
  router.patch(
    '/profile',
    userAuth.authenticate,
    asyncHandler(controller.editOnboardingProfile),
  );
  router.patch(
    '/travel-style',
    userAuth.authenticate,
    validate(TravelStyleSchema),
    asyncHandler(controller.editTravelStyle),
  );
  return router;
}
