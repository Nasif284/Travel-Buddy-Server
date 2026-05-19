import express, { Application } from 'express';
import { AppContainer } from '../../infrastructure/di/container';
import cors from 'cors';
import { config } from '../../config/env.config';
import helmet from 'helmet';
import morganMiddleware from '../../infrastructure/logging/morgan.middleware';
import cookieParser from 'cookie-parser';
import { buildRoutes } from '../routes';
import { globalErrorHandler } from '../middleware/error.middleware';
export class App {
  private readonly app: Application;
  constructor(private readonly container: AppContainer) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }
  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: config.frontend_url,
        credentials: true,
      }),
    );
    this.app.use(helmet());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(morganMiddleware);

    this.app.use(cookieParser());
  }
  private initializeRoutes(): void {
    this.app.get('/', (_, res) => {
      res.send('API Running...');
    });
    this.app.use('/api/v1', buildRoutes(this.container));
  }
  private initializeErrorHandling(): void {
    this.app.use(globalErrorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}
