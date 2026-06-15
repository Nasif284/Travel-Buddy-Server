import { OnboardingProfileRequestDTO } from '../../../dtos/onbaording/request/profile.dto';

export interface ISetUserProfile {
  execute(dto: OnboardingProfileRequestDTO): Promise<void>;
}
