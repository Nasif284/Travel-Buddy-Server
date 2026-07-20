import { injectable, inject } from 'tsyringe';
import { IPhoneOtpService } from '../../application/interfaces/services/phone-otp-storage.service.interface';
import { TOKENS } from '../di/tokens';
import Redis from 'ioredis';

@injectable()
export class RedisPhoneOtpService implements IPhoneOtpService {
  private readonly OTP_TTL = 60 * 5;

  constructor(
    @inject(TOKENS.RedisClient)
    private readonly redisService: Redis,
  ) {}

  private getKey(phone: string): string {
    return `verification:phone:otp:${phone}`;
  }

  async save(phone: string, otp: string): Promise<void> {
    await this.redisService.setex(this.getKey(phone), this.OTP_TTL, otp);
  }

  async get(phone: string): Promise<string | null> {
    return this.redisService.get(this.getKey(phone));
  }

  async delete(phone: string): Promise<void> {
    await this.redisService.del(this.getKey(phone));
  }

  async hasActiveOtp(phone: string): Promise<boolean> {
    const exists = await this.redisService.exists(this.getKey(phone));
    return exists === 1;
  }
}
