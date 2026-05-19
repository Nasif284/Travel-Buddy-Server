import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
export class DbManager {
  private static _instance: PrismaClient;
  static getInstance(): PrismaClient {
    if (!this._instance) {
      this._instance = new PrismaClient({
        log: ['warn', 'error'],
        adapter,
      });
    }
    return this._instance;
  }
}
