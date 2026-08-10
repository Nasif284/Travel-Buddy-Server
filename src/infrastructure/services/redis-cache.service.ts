import { inject, injectable } from 'tsyringe';
import { ICacheService } from '../../application/interfaces/services/cache.service.interface';
import { TOKENS } from '../di/tokens';
import Redis from 'ioredis';

@injectable()
export class RedisCacheService implements ICacheService {
  constructor(
    @inject(TOKENS.RedisClient)
    private readonly redis: Redis,
  ) {}

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, ttl: number, value: string) {
    await this.redis.setex(key, ttl, value);
  }

  async delete(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    await this.redis.del(...keys);
  }

  async exists(key: string) {
    return (await this.redis.exists(key)) === 1;
  }

  async keys(pattern: string) {
    return this.redis.keys(pattern);
  }

  async ttl(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }
}
