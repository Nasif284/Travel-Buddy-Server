import { inject, injectable } from 'tsyringe';
import { IDeactivateConnection } from '../../interfaces/use-cases/connections/deactivate-connections.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
@injectable()
export class DeactivateConnection implements IDeactivateConnection {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: { connectionId: string }): Promise<void> {
    await this._userRepository.deactivateConnection(dto.connectionId);
  }
}
