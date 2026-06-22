import { Router } from 'express';
import { ProfileController } from '../../../controllers/user/profile/profile.controller';
import { authenticate } from '../../../middleware/user/auth/userAuth.middleware';
import { asyncHandler } from '../../../middleware/error/asyncHandler';
import { upload } from '../../../middleware/storage/multer.middleware';

export function buildProfileRoutes(controller: ProfileController): Router {
  const router = Router();
  router.patch('/', authenticate, asyncHandler(controller.updateProfile));
  router.patch(
    '/avatar',
    authenticate,
    upload.single('avatar'),
    asyncHandler(controller.updateAvatar),
  );
  router.patch(
    '/cover',
    authenticate,
    upload.single('cover'),
    asyncHandler(controller.updateCover),
  );
  router.patch(
    '/settings',
    authenticate,
    asyncHandler(controller.updateSettings),
  );
  router.get('/settings', authenticate, asyncHandler(controller.getSettings));
  return router;
}
