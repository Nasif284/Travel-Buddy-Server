import { EmailVerificationRequestDTO } from '../../../../dtos/auth/user/request/email-verification.dto';
import { EmailVerificationResponseDTO } from '../../../../dtos/auth/user/responce/email-verification.dto';
export interface IVerifyEmail {
  execute(
    dto: EmailVerificationRequestDTO,
  ): Promise<EmailVerificationResponseDTO>;
}
