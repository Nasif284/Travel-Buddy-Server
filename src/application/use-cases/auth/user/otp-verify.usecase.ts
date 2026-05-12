import { RedisOtpService } from '../../../../infrastructure/services/redisOtp.service';
import { VerifyOtpRequestDTO } from '../../../dtos/auth/user/request/verify-otp.dto';
import { CommonResponseDTO } from '../../../dtos/common-response.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';

export class VerifyOtp implements IBaseUseCase<
  VerifyOtpRequestDTO,
  CommonResponseDTO
> {
  constructor(private readonly _otpService: RedisOtpService) {}
  async execute(dto: VerifyOtpRequestDTO): Promise<CommonResponseDTO> {
    const { code, email, purpose } = dto;
    await this._otpService.verify(email, code, purpose);
    return {
      success: true,
      message: 'Otp Verified Successfully',
    };
  }
}
