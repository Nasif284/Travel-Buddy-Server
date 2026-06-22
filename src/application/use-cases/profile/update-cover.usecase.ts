import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IUpdateCover } from '../../interfaces/use-cases/profile/update-cover.interface';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class UpdateCover implements IUpdateCover {
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
    const coverKey = `users/cover-images/${crypto.randomUUID()}`;
    await this._storageService.upload(dto.file, coverKey, dto.mimeType);
    await this._userRepository.updateUser(dto.userId, { coverUrl: coverKey });
  }
}
