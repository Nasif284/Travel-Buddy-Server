import { SendOtpRequestDTO } from '../../../dtos/auth/user/request/send-otp.dto';
import { SendOtpResponseDTO } from '../../../dtos/auth/user/responce/send-otp.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';

export class SendOtp implements IBaseUseCase<
  SendOtpRequestDTO,
  SendOtpResponseDTO
> {
  constructor(private readonly _otpService: IOtpService) {}
  async execute(dto: SendOtpRequestDTO): Promise<SendOtpResponseDTO> {
    const { email, purpose } = dto;
    await this._otpService.send(email, purpose);
    return { message: 'Otp resend to email successfully' };
  }
}
