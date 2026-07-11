import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IWithdrawRequest } from '../../interfaces/use-cases/connections/withdraw-request.interface';
@injectable()
export class WithdrawRequest implements IWithdrawRequest {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: { requestId: string }): Promise<void> {
    await this._userRepository.updateRequestStatus({
      requestId: dto.requestId,
      status: 'cancelled',
    });
  }
}
