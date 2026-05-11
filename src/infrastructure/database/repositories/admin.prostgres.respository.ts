import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../schema';
import {
  CreateAdminData,
  IAdminRepository,
} from '../../../application/interfaces/repositories/admin.respository';

export class PostgresAdminRepository implements IAdminRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findById(id: string): Promise<schema.AdminRecord | null> {
    const result = await this.db.query.admins.findFirst({
      where: and(eq(schema.admins.id, id)),
    });

    if (!result) return null;
    return result;
  }
  async create(data: CreateAdminData): Promise<schema.AdminRecord> {
    const role = await this.db.query.roles.findFirst({
      where: eq(schema.roles.name, data.role),
    });
    if (!role) {
      throw new Error('Invalid admin role');
    }
    const [newAdmin] = await this.db
      .insert(schema.admins)
      .values({
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: role.id,
      })
      .returning({ id: schema.admins.id });

    const admin = await this.db.query.admins.findFirst({
      where: eq(schema.admins.id, newAdmin.id),
    });
    if (!admin) {
      throw new Error('Admin creation failed');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<schema.AdminRecord | null> {
    const result = await this.db.query.admins.findFirst({
      where: and(eq(schema.admins.email, email)),
    });

    if (!result) return null;
    return result;
  }
}
