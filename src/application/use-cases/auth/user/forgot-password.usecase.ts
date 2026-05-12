import { RedisOtpService } from '../../../../infrastructure/services/redisOtp.service';
import { ForgotPasswordRequestDTO } from '../../../dtos/auth/user/request/fortgot-password.dto';
import { ForgotPasswordResponseDTO } from '../../../dtos/auth/user/responce/forgot-password.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';

export class ForgotPassword implements IBaseUseCase<
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO
> {
  constructor(private readonly _otpService: RedisOtpService) {}
  async execute(
    dto: ForgotPasswordRequestDTO,
  ): Promise<ForgotPasswordResponseDTO> {
    const { email } = dto;
    await this._otpService.send(email, 'password_reset');
    return { message: 'Otp sent to email successfully' };
  }
}
