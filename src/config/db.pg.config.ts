import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from './env.config';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({
  connectionString,
  ssl:
    config.env === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});
export class DbManager {
  private static _instance: PrismaClient;
  static getInstance(): PrismaClient {
    if (!this._instance) {
      this._instance = new PrismaClient({
        log: ['warn', 'error'],
        adapter,
      });
    }
    console.log('env:', config.env);
    return this._instance;
  }
}
