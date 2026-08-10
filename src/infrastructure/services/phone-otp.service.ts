import { injectable, inject } from 'tsyringe';
import { IPhoneOtpService } from '../../application/interfaces/services/phone-otp-storage.service.interface';
import { TOKENS } from '../di/tokens';
import { ICacheService } from '../../application/interfaces/services/cache.service.interface';

@injectable()
export class RedisPhoneOtpService implements IPhoneOtpService {
  private readonly OTP_TTL = 60 * 5;

  constructor(
    @inject(TOKENS.ICacheService)
    private readonly _cacheService: ICacheService,
  ) {}

  private getKey(phone: string): string {
    return `verification:phone:otp:${phone}`;
  }

  async save(phone: string, otp: string): Promise<void> {
    await this._cacheService.set(this.getKey(phone), this.OTP_TTL, otp);
  }

  async get(phone: string): Promise<string | null> {
    return this._cacheService.get(this.getKey(phone));
  }

  async delete(phone: string): Promise<void> {
    await this._cacheService.delete(this.getKey(phone));
  }

  async hasActiveOtp(phone: string): Promise<boolean> {
    return await this._cacheService.exists(this.getKey(phone));
  }
}
