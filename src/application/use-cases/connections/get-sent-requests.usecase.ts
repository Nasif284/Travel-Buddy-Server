import { inject, injectable } from 'tsyringe';
import { IGetSentRequests } from '../../interfaces/use-cases/connections/get-sent-requestes.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { GetSentRequestsResponseDTO } from '../../dtos/connections/response/get-sent-requests.dto';
@injectable()
export class GetSentRequests implements IGetSentRequests {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { userId: string }): Promise<GetSentRequestsResponseDTO> {
    const result = await this._userRepository.getSentRequests(dto.userId);
    return {
      requests: await Promise.all(
        result.requests.map(async (req) => {
          return {
            ...req,
            receiver: {
              ...req.receiver,
              avatarUrl: await this._storageService.getSignedUrl(
                req.receiver.avatarUrl!,
              ),
            },
          };
        }),
      ),
    };
  }
}
