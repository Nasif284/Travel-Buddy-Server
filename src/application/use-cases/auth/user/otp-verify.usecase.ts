import { VerifyOtpRequestDTO } from '../../../dtos/auth/user/request/verify-otp.dto';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { IVerifyOtp } from '../../../interfaces/use-cases/auth/user/verify-otp.interface';

export class VerifyOtp implements IVerifyOtp {
  constructor(private readonly _otpService: IOtpService) {}
  async execute(dto: VerifyOtpRequestDTO): Promise<void> {
    const { code, email, purpose } = dto;
    await this._otpService.verify(email, code, purpose);
  }
}
