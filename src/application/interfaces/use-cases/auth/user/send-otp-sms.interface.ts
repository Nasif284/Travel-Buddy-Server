import { SendPhoneOtpRequestDTO } from '../../../../dtos/auth/user/request/send-sms-otp.dto';

export interface ISendPhoneOtp {
  execute(dto: SendPhoneOtpRequestDTO): Promise<void>;
}
