import { OnboardingSourceRequestDTO } from '../../../dtos/onbaording/request/source.dto';

export interface IOnboardingSource {
  execute(dto: OnboardingSourceRequestDTO): Promise<void>;
}
