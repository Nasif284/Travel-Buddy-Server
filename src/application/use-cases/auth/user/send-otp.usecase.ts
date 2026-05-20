import { inject, injectable } from 'tsyringe';
import { SendOtpRequestDTO } from '../../../dtos/auth/user/request/send-otp.dto';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { ISendOtp } from '../../../interfaces/use-cases/auth/user/send-otp.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class SendOtp implements ISendOtp {
  constructor(
    @inject(TOKENS.IOtpService) private readonly _otpService: IOtpService,
  ) {}
  async execute(dto: SendOtpRequestDTO): Promise<void> {
    const { email, purpose } = dto;
    await this._otpService.send(email, purpose);
  }
}
