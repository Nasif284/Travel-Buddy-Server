import { container } from 'tsyringe';
import { UpdateProfile } from '../../../../application/use-cases/profile/update-profile.usecase';
import { UpdateCover } from '../../../../application/use-cases/profile/update-cover.usecase';
import { UpdateAvatar } from '../../../../application/use-cases/profile/update-avatar.usecase';
import { TOKENS } from '../../tokens';
import { UpdateSettings } from '../../../../application/use-cases/profile/update-settings.usecase';
import { GetSettings } from '../../../../application/use-cases/profile/get-settings.usecase';
import { SubmitVerificationUseCase } from '../../../../application/use-cases/profile/submit-doc-verification.usecase';
import { GetDocVerification } from '../../../../application/use-cases/profile/get-doc-verification.usecase';

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
  container.registerSingleton<SubmitVerificationUseCase>(
    TOKENS.ISubmitVerificationUseCase,
    SubmitVerificationUseCase,
  );
  container.registerSingleton<GetDocVerification>(
    TOKENS.IGetDocVerification,
    GetDocVerification,
  );
}
