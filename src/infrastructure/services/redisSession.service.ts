import { Redis } from 'ioredis';
import { ISessionService } from '../../application/interfaces/services/session.service.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';

@injectable()
export class RedisSessionService implements ISessionService {
  constructor(@inject(TOKENS.RedisClient) private readonly redis: Redis) {}

  private key(userId: string, tokenHash: string): string {
    return `session:${userId}:${tokenHash}`;
  }

  private pattern(userId: string): string {
    return `session:${userId}:*`;
  }

  async store(
    userId: string,
    tokenHash: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.setex(this.key(userId, tokenHash), ttlSeconds, '1');
  }

  async isValid(userId: string, tokenHash: string): Promise<boolean> {
    const result = await this.redis.exists(this.key(userId, tokenHash));
    return result === 1;
  }

  async revoke(userId: string, tokenHash: string): Promise<void> {
    await this.redis.del(this.key(userId, tokenHash));
  }

  async revokeAll(userId: string): Promise<void> {
    const keys = await this.redis.keys(this.pattern(userId));
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
