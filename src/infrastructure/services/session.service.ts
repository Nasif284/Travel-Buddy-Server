import { ISessionService } from '../../application/interfaces/services/session.service.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { ICacheService } from '../../application/interfaces/services/cache.service.interface';

@injectable()
export class RedisSessionService implements ISessionService {
  constructor(
    @inject(TOKENS.ICacheService) private readonly _cacheService: ICacheService,
  ) {}

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
    await this._cacheService.set(this.key(userId, tokenHash), ttlSeconds, '1');
  }

  async isValid(userId: string, tokenHash: string): Promise<boolean> {
    return await this._cacheService.exists(this.key(userId, tokenHash));
  }

  async revoke(userId: string, tokenHash: string): Promise<void> {
    await this._cacheService.delete(this.key(userId, tokenHash));
  }

  async revokeAll(userId: string): Promise<void> {
    const keys = await this._cacheService.keys(this.pattern(userId));
    if (keys.length > 0) {
      await this._cacheService.delete(...keys);
    }
  }
}
