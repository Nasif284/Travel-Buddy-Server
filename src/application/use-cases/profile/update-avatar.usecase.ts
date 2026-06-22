import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { IUpdateAvatar } from '../../interfaces/use-cases/profile/update-avatar.interface';
@injectable()
export class UpdateAvatar implements IUpdateAvatar {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: {
    userId: string;
    file: Buffer;
    mimeType: string;
  }): Promise<void> {
    const avatarKey = `users/profile-images/${crypto.randomUUID()}`;
    await this._storageService.upload(dto.file, avatarKey, dto.mimeType);
    await this._userRepository.updateUser(dto.userId, { avatarUrl: avatarKey });
  }
}
