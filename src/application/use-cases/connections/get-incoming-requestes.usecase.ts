import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { IGetIncomingRequests } from '../../interfaces/use-cases/connections/get-incomimg-requests.interface';
import { GetIncomingRequestsResponseDTO } from '../../dtos/connections/response/get-requests.dto';
@injectable()
export class GetIncomingRequests implements IGetIncomingRequests {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: {
    userId: string;
  }): Promise<GetIncomingRequestsResponseDTO> {
    const result = await this._userRepository.getIncomingConnectionRequests(
      dto.userId,
    );
    return {
      requests: await Promise.all(
        result.requests.map(async (req) => {
          return {
            ...req,
            sender: {
              ...req.sender,
              avatarUrl: await this._storageService.getSignedUrl(
                req.sender.avatarUrl!,
              ),
            },
          };
        }),
      ),
    };
  }
}
