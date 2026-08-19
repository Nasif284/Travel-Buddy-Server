import 'reflect-metadata';
import 'dotenv/config';
console.log('=== server.ts starting execution ===');
import { DbManager, getRedisClient } from './config';
import { buildContainer } from './infrastructure/di/container';
import { App } from './presentation/express/app';
import './infrastructure/jobs';
import { OpenRouterAIModelService } from './infrastructure/services/open-router-ai-model.service';
import { AiItineraryService } from './infrastructure/services/ai-itinerary.service';
import { context, dummyContext } from './tests/ai-itenery.test';
import { GooglePlacesService } from './infrastructure/services/google-places.service';
import { GooglePlacesClient } from './infrastructure/services/google-places-client.service';
import { buildPlacesContextNode } from './infrastructure/ai/ai-itinerary/nodes/place-context.node';
import { PlaceContextBuilder } from './infrastructure/ai/ai-itinerary/builder/ai-places.context.builder';
import { PlaceCategory } from './application/interfaces/services/places.service.interface';
import { ItineraryState } from './infrastructure/ai/ai-itinerary/itinerary.states';
import { AssistantService } from './infrastructure/services/ai-assistant.service';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerChatSocket } from './infrastructure/socket/chat.socket';
import { registerSocketAuth } from './infrastructure/socket/socket-auth.middleware';
import { registerCallSocket } from './infrastructure/socket/call.socket';
import { CallNotificationService } from './infrastructure/services/call-notification.service';

const PORT = parseInt(process.env.PORT ?? '3000');

async function bootstrap(): Promise<void> {
  console.log('[Server] Getting DB and Redis client instances...');
  const db = DbManager.getInstance();
  const redis = getRedisClient();

  // const aiItineraryService = new AiItineraryService(new OpenRouterAIModelService(),new GooglePlacesService(new GooglePlacesClient))
  // const itinerary = await aiItineraryService.generate(context);

  // console.dir(itinerary, {
  //   depth: null,
  // });
  // const ai = new AssistantService(new OpenRouterAIModelService())
  //   const chat = await ai.chat(dummyContext,"hi , i am bored")
  //   console.log(chat)

  try {
    console.log('[Server] Connecting to PostgreSQL database...');
    await db.$connect();
    console.log('[PostgreSQL] Connection verified');
  } catch (err) {
    console.error('[PostgreSQL] Failed to connect:', err);
    process.exit(1);
  }

  try {
    console.log('[Server] Pinging Redis...');
    await redis.ping();
    console.log('Redis Connection verified');
  } catch (err) {
    console.error('redis Failed to connect:', err);
    process.exit(1);
  }

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });
  const container = buildContainer(db, redis, io);
  const app = new App(container).getServer();
  httpServer.on('request', app);

  registerSocketAuth(io);
  registerChatSocket(io);
  registerCallSocket(io);
  httpServer.listen(PORT, () => {
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
