import { EditOnboardingProfileRequestDTO } from '../../../dtos/onbaording/request/edit-profile.dto';

export interface IEditOnboardingProfile {
  execute(dto: EditOnboardingProfileRequestDTO): Promise<void>;
}
