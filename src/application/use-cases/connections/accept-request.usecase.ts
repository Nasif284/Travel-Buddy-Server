import { inject, injectable } from 'tsyringe';
import { IAcceptRequest } from '../../interfaces/use-cases/connections/accept-request.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
@injectable()
export class AcceptRequest implements IAcceptRequest {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: { requestId: string }): Promise<void> {
    await this._userRepository.updateRequestStatus({
      requestId: dto.requestId,
      status: 'accepted',
    });
  }
}
