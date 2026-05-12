import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PostgresAdminRepository } from '../../database/repositories/admin.prostgres.respository';
import * as schema from '../../database/schema';
import { PostgresUserRepository } from '../../database/repositories/user.postgres.repository';

export function BuildAdminRepositories(db: NodePgDatabase<typeof schema>) {
  return {
    adminRepository: new PostgresAdminRepository(db),
    userRepository: new PostgresUserRepository(db),
  };
}
