import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { buildRoutes } from '../routes';

import { AppContainer } from '../../infrastructure/di/container';
import { globalErrorHandler } from '../middleware/error.middleware';
import morganMiddleware from '../../infrastructure/logging/morgan.middleware';

export function createApp(container: AppContainer): Application {
  const app = express();
  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morganMiddleware);
  app.use(cookieParser());
  app.get('/', (req, res) => {
    res.send('jhklfdsakf');
  });
  app.use('/api/v1', buildRoutes(container));

  app.use(globalErrorHandler);

  return app;
}
