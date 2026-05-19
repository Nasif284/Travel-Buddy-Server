import { EmailVerificationRequestDTO } from '../../../dtos/auth/user/request/email-verification.dto';
import { EmailVerificationResponseDTO } from '../../../dtos/auth/user/responce/email-verification.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';

export class EmailVerification implements IBaseUseCase<
  EmailVerificationRequestDTO,
  EmailVerificationResponseDTO
> {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(
    dto: EmailVerificationRequestDTO,
  ): Promise<EmailVerificationResponseDTO> {
    const { code, email } = dto;
    await this._otpService.verify(email, code, 'email_verify');
    await this._userRepository.updateEmailVerified(email);
    return {
      success: true,
      message: 'Email Verified Successfully',
      data: {
        email,
      },
    };
  }
}
