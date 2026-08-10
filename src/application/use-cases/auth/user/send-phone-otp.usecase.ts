import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IPhoneOtpService } from '../../../interfaces/services/phone-otp-storage.service.interface';
import { ISmsService } from '../../../interfaces/services/sms-service.service.interface';
import { SendPhoneOtpRequestDTO } from '../../../dtos/auth/user/request/send-sms-otp.dto';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import {
  InvalidPhoneNumberError,
  PhoneAlreadyInUseError,
  PhoneOtpSendFailedError,
} from '../../../../domain/errors/auth.error';
import { ISendPhoneOtp } from '../../../interfaces/use-cases/auth/user/send-otp-sms.interface';

@injectable()
export class SendPhoneOtp implements ISendPhoneOtp {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TOKENS.IPhoneOtpService)
    private readonly phoneOtpService: IPhoneOtpService,

    @inject(TOKENS.ISmsService)
    private readonly smsService: ISmsService,
  ) {}

  async execute(dto: SendPhoneOtpRequestDTO): Promise<void> {
    const phone = dto.phone.trim();

    if (!phone.startsWith('+') || phone.length < 10) {
      throw new InvalidPhoneNumberError();
    }

    const existingUser = await this.userRepository.findUserByPhone(phone);

    if (
      existingUser &&
      existingUser.id !== dto.userId &&
      existingUser.isPhoneVerified
    ) {
      throw new PhoneAlreadyInUseError();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await this.phoneOtpService.save(phone, otp);
      await this.smsService.sendOtp(phone, otp);
    } catch (err) {
      console.log(err);
      await this.phoneOtpService.delete(phone);
      throw new PhoneOtpSendFailedError();
    }
  }
}
