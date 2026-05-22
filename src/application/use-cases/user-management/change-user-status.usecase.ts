import { inject, injectable } from 'tsyringe';
import { ChangeUserStatusRequestDTO } from '../../dtos/user-management/request/change-status.dto';
import { IChangeUserStatus } from '../../interfaces/use-cases/user-management/change-user-status.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';

@injectable()
export class ChangeUserStatus implements IChangeUserStatus {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: ChangeUserStatusRequestDTO): Promise<void> {
    await this._userRepository.changeUserStatus(dto);
  }
}
