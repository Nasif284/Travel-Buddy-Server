import { inject, injectable } from 'tsyringe';
import Redis from 'ioredis';
import { TOKENS } from '../di/tokens';
import {
  IPresenceService,
  UserPresenceStatus,
} from '../../application/interfaces/services/presence.service.interface';

@injectable()
export class PresenceService implements IPresenceService {
  private readonly SOCKETS_KEY_PREFIX = 'presence:sockets:';
  private readonly ONLINE_HASH = 'presence:online';
  private readonly LAST_SEEN_HASH = 'presence:last_seen';

  constructor(
    @inject(TOKENS.RedisClient)
    private readonly redis: Redis,
  ) {}

  async setUserOnline(
    userId: string,
    socketId: string,
  ): Promise<{ isFirstSocket: boolean }> {
    const socketsKey = `${this.SOCKETS_KEY_PREFIX}${userId}`;
    const addedCount = await this.redis.sadd(socketsKey, socketId);
    const socketCount = await this.redis.scard(socketsKey);

    const isFirstSocket = socketCount === 1 || addedCount === 1;

    if (isFirstSocket) {
      await this.redis.hset(this.ONLINE_HASH, userId, 'true');
      await this.redis.hdel(this.LAST_SEEN_HASH, userId);
    }

    return { isFirstSocket };
  }

  async setUserOffline(
    userId: string,
    socketId: string,
  ): Promise<{ isFullyOffline: boolean; lastSeen: string }> {
    const socketsKey = `${this.SOCKETS_KEY_PREFIX}${userId}`;
    await this.redis.srem(socketsKey, socketId);
    const remainingCount = await this.redis.scard(socketsKey);

    const isFullyOffline = remainingCount === 0;
    const lastSeen = new Date().toISOString();

    if (isFullyOffline) {
      await this.redis.hdel(this.ONLINE_HASH, userId);
      await this.redis.hset(this.LAST_SEEN_HASH, userId, lastSeen);
    }

    return { isFullyOffline, lastSeen };
  }

  async getUsersPresence(
    userIds: string[],
  ): Promise<Record<string, UserPresenceStatus>> {
    if (!userIds || userIds.length === 0) return {};

    const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
    const onlineResults = await this.redis.hmget(
      this.ONLINE_HASH,
      ...uniqueIds,
    );
    const lastSeenResults = await this.redis.hmget(
      this.LAST_SEEN_HASH,
      ...uniqueIds,
    );

    const presenceMap: Record<string, UserPresenceStatus> = {};

    uniqueIds.forEach((id, index) => {
      const isOnline = onlineResults[index] === 'true';
      const lastSeen = lastSeenResults[index] ?? undefined;
      presenceMap[id] = { isOnline, lastSeen };
    });

    return presenceMap;
  }

  async getUserPresence(userId: string): Promise<UserPresenceStatus> {
    const presence = await this.getUsersPresence([userId]);
    return presence[userId] ?? { isOnline: false };
  }
}
