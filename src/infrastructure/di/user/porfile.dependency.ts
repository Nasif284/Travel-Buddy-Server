import { container } from 'tsyringe';
import { UpdateProfile } from '../../../application/use-cases/profile/update-profile.usecase';
import { UpdateCover } from '../../../application/use-cases/profile/update-cover.usecase';
import { UpdateAvatar } from '../../../application/use-cases/profile/update-avatar.usecase';
import { TOKENS } from '../tokens';
import { UpdateSettings } from '../../../application/use-cases/profile/update-settings.usecase';
import { GetSettings } from '../../../application/use-cases/profile/get-settings.usecase';

export function registerProfileDependency() {
  container.registerSingleton<UpdateProfile>(
    TOKENS.IUpdateProfile,
    UpdateProfile,
  );
  container.registerSingleton<UpdateCover>(TOKENS.IUpdateCover, UpdateCover);
  container.registerSingleton<UpdateAvatar>(TOKENS.IUpdateAvatar, UpdateAvatar);
  container.registerSingleton<UpdateSettings>(
    TOKENS.IUpdateSettings,
    UpdateSettings,
  );
  container.registerSingleton<GetSettings>(TOKENS.IGetSettings, GetSettings);
}
