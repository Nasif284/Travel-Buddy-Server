import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../infrastructure/database/schema';
let pool: Pool;
let db: NodePgDatabase<typeof schema>;
export function getDatabasePool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected pool error:', err);
    });

    pool.on('connect', () => {
      console.log('[PostgreSQL] New client connected');
    });
  }
  return pool;
}

export function getDB() {
  if (!db) {
    const p = getDatabasePool();
    db = drizzle(p, { schema});
  }
  return db;
}
