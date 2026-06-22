import { inject, injectable } from 'tsyringe';
import { IGetMe } from '../../interfaces/use-cases/users/get-me.usecase';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { GetUserProfileResponseDTO } from '../../dtos/users/response/user-profile.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetMe implements IGetMe {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { userId: string }): Promise<GetUserProfileResponseDTO> {
    const user = await this._userRepository.getUserWithDetails(dto.userId);
    return {
      ...user,
      avatarUrl: await this._storageService.getSignedUrl(user.avatarUrl!),
      coverUrl: await this._storageService.getSignedUrl(user.coverUrl!),
    };
  }
}
