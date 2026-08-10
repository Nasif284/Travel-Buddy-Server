import { Redis } from 'ioredis';

let client: Redis;

export function getRedisClient(): Redis {
  if (!client) {
    client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
      lazyConnect: false,
    });

    client.on('connect', () => {
      console.log('[Redis] Connected');
    });

    client.on('error', (err) => {
      console.error('[Redis] Error:', err);
    });
  }
  return client;
}
