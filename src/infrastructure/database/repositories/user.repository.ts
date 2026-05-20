// prisma.user.repository.ts

import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { BaseRepository } from './base.repository';

import {
  IUserRepository,
  CreateUserData,
} from '../../../application/interfaces/repositories/user.reposetory';

import { User } from '../../../domain/entities/user/user.entity';

import { UserMapper } from '../mappers/user.mapper';

import { GetAllUsersRequestDTO } from '../../../application/dtos/user-management/request/get-users.dto';

export class UserRepository
  extends BaseRepository<
    PrismaUser,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput
  >
  implements IUserRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.user);
  }

  private async findUserWithDetails(
    where: Prisma.UserWhereInput,
  ): Promise<User | null> {
    const result = await this.findFirst({
      ...where,
      deletedAt: null,
    });
    if (!result) return null;

    return UserMapper.toDomain(result);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.findUserWithDetails({
      id,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findUserWithDetails({
      email,
    });
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName: data.fullName,

          email: data.email,

          passwordHash: data.passwordHash,

          ...(data.avatarUrl && {
            avatarUrl: data.avatarUrl,

            isEmailVerified: true,
          }),
        },
      });

      await tx.userPrivacy.create({
        data: {
          userId: createdUser.id,
        },
      });

      return createdUser;
    });

    return UserMapper.toDomain(user);
  }

  async updateEmailVerified(email: string): Promise<void> {
    await this.update(
      { email },
      {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    );
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.update(
      { id },
      {
        passwordHash,
      },
    );
  }

  async getAllUsers(payload: GetAllUsersRequestDTO): Promise<{
    users: User[];
    count: number;
  }> {
    const { page, limit, filter } = payload;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filter.status) {
      where.accountStatusCode = filter.status;
    }

    if (filter.joined === 'last_7_days') {
      const date = new Date();

      date.setDate(date.getDate() - 7);

      where.createdAt = {
        gte: date,
      };
    }

    if (filter.joined === 'last_30_days') {
      const date = new Date();

      date.setDate(date.getDate() - 30);

      where.createdAt = {
        gte: date,
      };
    }

    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      users: users.map(UserMapper.toDomain),
      count,
    };
  }
}
