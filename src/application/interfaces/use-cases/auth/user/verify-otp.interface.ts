import { VerifyOtpRequestDTO } from '../../../../dtos/auth/user/request/verify-otp.dto';
export interface IVerifyOtp {
  execute(dto: VerifyOtpRequestDTO): Promise<void>;
}
