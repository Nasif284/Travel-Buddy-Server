import { inject, injectable } from 'tsyringe';
import { IGetSettings } from '../../interfaces/use-cases/profile/get-settings.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { GetSettingsResponseDTO } from '../../dtos/profile/response/get-settings.dto';
@injectable()
export class GetSettings implements IGetSettings {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dot: { userId: string }): Promise<GetSettingsResponseDTO> {
    return await this._userRepository.getSettings(dot.userId);
  }
}
