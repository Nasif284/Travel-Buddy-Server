import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { ResetPasswordRequestDTO } from '../../../dtos/auth/user/request/reset-password.dto';
import { ResetPasswordResponseDTO } from '../../../dtos/auth/user/responce/reset-password.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IHashService } from '../../../interfaces/services/hash.service.interface';

export class ResetPassword implements IBaseUseCase<
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO
> {
  constructor(
    private readonly _hashService: IHashService,
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(
    dto: ResetPasswordRequestDTO,
  ): Promise<ResetPasswordResponseDTO> {
    const { password, email } = dto;
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    const passwordHash = await this._hashService.hash(password);
    await this._userRepository.updatePassword(user.id, passwordHash);
    return {
      success: true,
      message: 'Password Reset Successfully',
    };
  }
}
