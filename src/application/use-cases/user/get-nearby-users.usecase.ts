import { inject, injectable } from 'tsyringe';
import { IGetNearbyUsers } from '../../interfaces/use-cases/users/nearby-users.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { GetNearbyUsersRequestDTO } from '../../dtos/users/request/nearby-users.dto';
import { NearbyUsersResponseDTO } from '../../dtos/users/response/nearby-users.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetNearbyUsers implements IGetNearbyUsers {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(
    dto: GetNearbyUsersRequestDTO,
  ): Promise<NearbyUsersResponseDTO> {
    const { limit, page, total, users, totalPages } =
      await this._userRepository.getNearbyUsers(
        dto.userId,
        dto.page,
        dto.limit,
        dto.radiusKm ?? 50,
      );

    return {
      users: await Promise.all(
        users.map(async (user) => ({
          ...user,
          avatarUrl: user.avatarUrl
            ? await this._storageService.getSignedUrl(user.avatarUrl)
            : null,
          coverUrl: user.coverUrl
            ? await this._storageService.getSignedUrl(user.coverUrl)
            : null,
        })),
      ),
      limit,
      page,
      total,
      totalPages,
    };
  }
}
