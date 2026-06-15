import { inject, injectable } from 'tsyringe';
import { TravelStyleRequestDTO } from '../../dtos/onbaording/request/travel-style.dto';
import { ISetTravelStyle } from '../../interfaces/use-cases/onboarding/travel-style.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';

@injectable()
export class SetTravelStyle implements ISetTravelStyle {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: TravelStyleRequestDTO): Promise<void> {
    await this._userRepository.updateUser(dto.userId, {
      travelTypeCode: dto.travelType,
      travelPersonalityCode: dto.travelPersonality,
      matchWithCode: dto.matchWith,
    });
    await this._userRepository.createTravelInterests(dto.userId, dto.interests);
    await this._userRepository.updateOnboarding(dto.userId, {
      onboardingCompleted: true,
      completedAt: new Date(),
    });
  }
}
