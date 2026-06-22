import { inject, injectable } from 'tsyringe';
import { IGetAllRequests } from '../../interfaces/use-cases/connections/get-all-requests.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { GetAllRequestsResponseDTO } from '../../dtos/connections/response/get-all-requests.dto';
@injectable()
export class GetAllRequests implements IGetAllRequests {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: { userId: string }): Promise<GetAllRequestsResponseDTO> {
    return await this._userRepository.getUserRequests(dto.userId);
  }
}
