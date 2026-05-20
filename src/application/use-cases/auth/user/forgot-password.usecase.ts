import { ForgotPasswordRequestDTO } from '../../../dtos/auth/user/request/fortgot-password.dto';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { IForgotPassword } from '../../../interfaces/use-cases/auth/user/forgot-password.interface';

export class ForgotPassword implements IForgotPassword {
  constructor(private readonly _otpService: IOtpService) {}
  async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
    const { email } = dto;
    await this._otpService.send(email, 'password_reset');
  }
}
