import { inject, injectable } from 'tsyringe';
import { ISendConnectionRequest } from '../../interfaces/use-cases/connections/send-connection-request.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { SendConnectionRequestDTO } from '../../dtos/connections/requests/send-connection-request.dto';
@injectable()
export class SendConnectionRequest implements ISendConnectionRequest {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: SendConnectionRequestDTO): Promise<void> {
    await this._userRepository.sendConnectionRequest(dto);
  }
}
