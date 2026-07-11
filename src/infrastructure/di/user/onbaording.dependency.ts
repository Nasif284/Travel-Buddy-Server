import { container } from 'tsyringe';
import { OnboardingSource } from '../../../application/use-cases/onboarding/onboarding-source.usecase';
import { TOKENS } from '../tokens';
import { SetUserProfile } from '../../../application/use-cases/onboarding/profile.usecase';
import { SetTravelStyle } from '../../../application/use-cases/onboarding/travel-style.usecase';
import { EditOnboardingProfile } from '../../../application/use-cases/onboarding/edit-profile.usecase';
import { EditTravelStyle } from '../../../application/use-cases/onboarding/edit-travel-style.usecase';

export function registerOnboardingDependency() {
  container.registerSingleton<OnboardingSource>(
    TOKENS.IOnboardingSource,
    OnboardingSource,
  );
  container.registerSingleton<SetUserProfile>(
    TOKENS.ISetProfile,
    SetUserProfile,
  );
  container.registerSingleton<SetTravelStyle>(
    TOKENS.ISetTravelStyle,
    SetTravelStyle,
  );
  container.registerSingleton<EditOnboardingProfile>(
    TOKENS.IEditOnboardingProfile,
    EditOnboardingProfile,
  );
  container.registerSingleton<EditTravelStyle>(
    TOKENS.IEditOnboardingTravelStyle,
    EditTravelStyle,
  );
}
