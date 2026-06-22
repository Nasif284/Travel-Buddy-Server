import { inject, injectable } from 'tsyringe';
import { IUpdateSettings } from '../../interfaces/use-cases/profile/settings-update.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { UpdateSettingsRequestDTO } from '../../dtos/profile/request/settings-update.dto';
@injectable()
export class UpdateSettings implements IUpdateSettings {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: {
    userId: string;
    payload: UpdateSettingsRequestDTO;
  }): Promise<void> {
    await this._userRepository.updateSettings(dto.userId, dto.payload);
  }
}
