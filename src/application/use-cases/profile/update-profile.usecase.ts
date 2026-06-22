import { inject, injectable } from 'tsyringe';
import { IUpdateProfile } from '../../interfaces/use-cases/profile/update-profile.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { UpdateProfileRequestDTO } from '../../dtos/profile/request/update-profile.dto';
@injectable()
export class UpdateProfile implements IUpdateProfile {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: {
    userId: string;
    payload: UpdateProfileRequestDTO;
  }): Promise<void> {
    const {
      bio,
      fullName,
      isTraveling,
      travelPersonalityCode,
      interests,
      languages,
      skills,
    } = dto.payload;
    const user = await this._userRepository.getUserWithDetails(dto.userId);
    const filteredInterests = user.interests.filter(
      (e) => !interests?.includes(e),
    );
    const filteredLanguages = user.languages.filter(
      (e) => !languages?.includes(e),
    );
    const filteredSkills = user.skills.filter((e) => !skills?.includes(e));
    if (filteredInterests.length > 0) {
      await this._userRepository.createTravelInterests(
        dto.userId,
        filteredInterests,
      );
    }
    if (filteredLanguages.length > 0) {
      await this._userRepository.createLanguages(dto.userId, filteredLanguages);
    }
    if (filteredSkills.length > 0) {
      await this._userRepository.createSkills(dto.userId, filteredSkills);
    }
    await this._userRepository.updateUser(dto.userId, {
      bio,
      fullName,
      isTraveling,
      travelPersonalityCode,
    });
  }
}
