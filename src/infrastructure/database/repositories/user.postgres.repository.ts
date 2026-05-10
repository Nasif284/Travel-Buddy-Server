import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, isNull } from 'drizzle-orm';
import * as schema from '../schema';
import {
  IUserRepository,
  CreateUserData,
} from '../../../application/interfaces/repositories/user.reposetory';
import { User } from '../../../domain/entities/user/user.entity';
import { UserMapper } from '../mappers/user/user.mapper';

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
        })
        .returning({ id: schema.users.id });

      await tx.insert(schema.userPrivacySettings).values({ userId: newUser.id })

      const user = await tx.query.users.findFirst({
        where: eq(schema.users.id, newUser.id),
      });
      return UserMapper.toDomain(user!);
    });
  }
  async updateEmailVerified(email: string): Promise<void> {
     await this.db.update(schema.users).set({isEmailVerified:true,emailVerifiedAt:new Date()}).where(eq(schema.users.email,email))
  }
}
