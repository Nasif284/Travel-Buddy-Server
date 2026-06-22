import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IRejectRequest } from '../../interfaces/use-cases/connections/reject-request.interface';
@injectable()
export class RejectRequest implements IRejectRequest {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: { requestId: string }): Promise<void> {
    await this._userRepository.updateRequestStatus({
      requestId: dto.requestId,
      status: 'rejected',
    });
  }
}
