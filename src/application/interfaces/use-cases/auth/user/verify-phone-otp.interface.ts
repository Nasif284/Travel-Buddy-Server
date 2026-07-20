import { VerifyPhoneOtpRequestDTO } from '../../../../dtos/auth/user/request/verify-phone.dto';

export interface IVerifyPhoneOtp {
  execute(dto: VerifyPhoneOtpRequestDTO): Promise<void>;
}
