import { inject, injectable } from 'tsyringe';
import { ForgotPasswordRequestDTO } from '../../../dtos/auth/user/request/fortgot-password.dto';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { IForgotPassword } from '../../../interfaces/use-cases/auth/user/forgot-password.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class ForgotPassword implements IForgotPassword {
  constructor(
    @inject(TOKENS.IOtpService) private readonly _otpService: IOtpService,
  ) {}
  async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
    const { email } = dto;
    await this._otpService.send(email, 'password_reset');
  }
}
