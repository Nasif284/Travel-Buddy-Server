import { SendOtpRequestDTO } from '../../../../dtos/auth/user/request/send-otp.dto';
export interface ISendOtp {
  execute(dto: SendOtpRequestDTO): Promise<void>;
}
