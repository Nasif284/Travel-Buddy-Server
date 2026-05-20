import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { ResetPasswordRequestDTO } from '../../../dtos/auth/user/request/reset-password.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IHashService } from '../../../interfaces/services/hash.service.interface';
import { IResetPassword } from '../../../interfaces/use-cases/auth/user/reset-password.interface';

export class ResetPassword implements IResetPassword {
  constructor(
    private readonly _hashService: IHashService,
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: ResetPasswordRequestDTO): Promise<void> {
    const { password, email } = dto;
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const passwordHash = await this._hashService.hash(password);
    await this._userRepository.updatePassword(user.id, passwordHash);
  }
}
