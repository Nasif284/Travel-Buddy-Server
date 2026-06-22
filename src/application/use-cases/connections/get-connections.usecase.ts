import { inject, injectable } from 'tsyringe';
import { IGetConnections } from '../../interfaces/use-cases/connections/get-connections.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { GetConnectionsResponseDTO } from '../../dtos/connections/response/get-connections.dto';
@injectable()
export class GetConnections implements IGetConnections {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { userId: string }): Promise<GetConnectionsResponseDTO> {
    const result = await this._userRepository.getUserConnections(dto.userId);
    console.log(result);
    return {
      connections: await Promise.all(
        result.connections.map(async (connection) => {
          return {
            ...connection,
            avatarUrl: await this._storageService.getSignedUrl(
              connection.avatarUrl!,
            ),
          };
        }),
      ),
    };
  }
}
