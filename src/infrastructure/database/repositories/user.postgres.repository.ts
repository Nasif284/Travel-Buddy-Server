import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, isNull, gte, desc, sql } from 'drizzle-orm';
import * as schema from '../schema';
import {
  IUserRepository,
  CreateUserData,
} from '../../../application/interfaces/repositories/user.reposetory';
import { User } from '../../../domain/entities/user/user.entity';
import { UserMapper } from '../mappers/user/user.mapper';
import { GetAllUsersRequestDTO } from '../../../application/dtos/user-management/request/get-users.dto';

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  private async findUserWithDetails(
    column: any,
    value: string,
  ): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: and(eq(column, value), isNull(schema.users.deletedAt)),
    });

    if (!result) return null;
    return UserMapper.toDomain(result);
  }

  async findById(id: string): Promise<User | null> {
    return this.findUserWithDetails(schema.users.id, id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findUserWithDetails(schema.users.email, email);
  }

  async create(data: CreateUserData): Promise<User> {
    return await this.db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(schema.users)
        .values({
          fullName: data.fullName,
          email: data.email,
          passwordHash: data.passwordHash,
          ...(data.avatarUrl && {
            avatarUrl: data.avatarUrl,
            isEmailVerified: true,
          }),
        })
        .returning({ id: schema.users.id });

      await tx
        .insert(schema.userPrivacySettings)
        .values({ userId: newUser.id });

      const user = await tx.query.users.findFirst({
        where: eq(schema.users.id, newUser.id),
      });
      return UserMapper.toDomain(user!);
    });
  }
  async updateEmailVerified(email: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ isEmailVerified: true, emailVerifiedAt: new Date() })
      .where(eq(schema.users.email, email));
  }
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ passwordHash })
      .where(eq(schema.users.id, id));
  }
  async getAllUsers(
    payload: GetAllUsersRequestDTO,
  ): Promise<{ users: schema.UserRecord[]; count: number } | null> {
    const { page, limit, filter, orderBy } = payload;
    const conditions = [isNull(schema.users.deletedAt)];
    if (filter.status) {
      conditions.push(eq(schema.users.accountStatusCode, filter.status));
    }
    if (filter.joined === 'last_7_days') {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      conditions.push(gte(schema.users.createdAt, date));
    }
    if (filter.joined === 'last_30_days') {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      conditions.push(gte(schema.users.createdAt, date));
    }
    const result = await this.db.query.users.findMany({
      where: and(...conditions),
      limit,
      offset: (page - 1) * limit,
      orderBy: desc(schema.users.createdAt),
    });
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(and(...conditions));
    if (!result) return null;
    return { users: result, count };
  }
}
