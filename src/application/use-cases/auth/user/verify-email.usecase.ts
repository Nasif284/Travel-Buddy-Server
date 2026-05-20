import { inject, injectable } from 'tsyringe';
import { EmailVerificationRequestDTO } from '../../../dtos/auth/user/request/email-verification.dto';
import { EmailVerificationResponseDTO } from '../../../dtos/auth/user/responce/email-verification.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { IVerifyEmail } from '../../../interfaces/use-cases/auth/user/verify-email.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class EmailVerification implements IVerifyEmail {
  constructor(
    @inject(TOKENS.IOtpService) private readonly _otpService: IOtpService,
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(
    dto: EmailVerificationRequestDTO,
  ): Promise<EmailVerificationResponseDTO> {
    const { code, email } = dto;
    await this._otpService.verify(email, code, 'email_verify');
    await this._userRepository.updateEmailVerified(email);
    return {
      email,
    };
  }
}
