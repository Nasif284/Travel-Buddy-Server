import 'dotenv/config';
import { DbManager, getRedisClient } from './config';
import { buildContainer } from './infrastructure/di/container';
import { App } from './presentation/express/app';
import 'reflect-metadata';

const PORT = parseInt(process.env.PORT ?? '3000');

async function bootstrap(): Promise<void> {
  const db = DbManager.getInstance();
  const redis = getRedisClient();

  try {
    await db.$connect();
    console.log('[PostgreSQL] Connection verified');
  } catch (err) {
    console.error('[PostgreSQL] Failed to connect:', err);
    process.exit(1);
  }

  try {
    await redis.ping();
    console.log('Redis Connection verified');
  } catch (err) {
    console.error('redis Failed to connect:', err);
    process.exit(1);
  }

  const container = buildContainer(db, redis);
  const app = new App(container).getServer();

  app.listen(PORT, () => {
    console.log(`[Server] Travel Buddy API running on port ${PORT}`);
    console.log(
      `[Server] Environment: ${process.env.NODE_ENV ?? 'development'}`,
    );
  });
  // const shutdown = async () => {
  //   console.log(`shutting down gracefully...`);
  //   await pool.end();
  //   await redis.quit();
  //   process.exit(0);
  // };
  // process.on('SIGTERM', shutdown);
  // process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
