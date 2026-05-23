import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { BaseRepository } from './base.repository';

import {
  IUserRepository,
  CreateUserData,
} from '../../../application/interfaces/repositories/user.reposetory';

import { User } from '../../../domain/entities/user/user.entity';

import { UserMapper } from '../mappers/user.mapper';

import { GetAllUsersRequestDTO } from '../../../application/dtos/user-management/request/get-users.dto';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { email } from 'zod';
import { ChangeUserStatusRequestDTO } from '../../../application/dtos/user-management/request/change-status.dto';
import { AccountStatus } from '../../../domain/enums';
@injectable()
export class UserRepository
  extends BaseRepository<
    PrismaUser,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput
  >
  implements IUserRepository
{
  constructor(@inject(TOKENS.PrismaClient) prisma: PrismaClient) {
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
    const { page, limit, filter, sortBy, sortOrder } = payload;
    const ALLOWED_SORT_COLUMNS = ['createdAt', 'fullName', 'email'] as const;
    type AllowedSort = (typeof ALLOWED_SORT_COLUMNS)[number];

    const safeSortBy: AllowedSort = ALLOWED_SORT_COLUMNS.includes(
      sortBy as AllowedSort,
    )
      ? (sortBy as AllowedSort)
      : 'createdAt';

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (filter.status && filter.status !== 'all') {
      where.accountStatusCode = filter.status;
    }

    if (filter.joined === '7d') {
      const date = new Date();

      date.setDate(date.getDate() - 7);

      where.createdAt = {
        gte: date,
      };
    }

    if (filter.joined === '30d') {
      const date = new Date();

      date.setDate(date.getDate() - 30);

      where.createdAt = {
        gte: date,
      };
    }

    if (filter.joined === '1y') {
      const date = new Date();

      date.setFullYear(date.getFullYear() - 1);

      where.createdAt = {
        gte: date,
      };
    }

    if (filter.search?.trim()) {
      where.OR = [
        {
          fullName: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filter.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (filter.verified && filter.verified !== 'any') {
      if (filter.verified == 'yes') {
        where.isEmailVerified = true;
      } else if (filter.verified == 'no') {
        where.isEmailVerified = false;
      }
    }
    const [users, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,

        skip: (page - 1) * limit,

        take: limit,

        orderBy: { [safeSortBy]: sortBy },
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
  async changeUserStatus(payload: ChangeUserStatusRequestDTO): Promise<void> {
    const { userId, action, reason } = payload;
    let accountStatusCode: AccountStatus;

    switch (action) {
      case 'activate':
        accountStatusCode = AccountStatus.ACTIVE;
        break;

      case 'suspend':
        accountStatusCode = AccountStatus.SUSPENDED;
        break;

      case 'ban':
        accountStatusCode = AccountStatus.BANNED;
        break;

      default:
        throw new Error('Invalid status');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId,
        },

        data: {
          accountStatusCode,
        },
      });
      await tx.userStatusHistory.create({
        data: {
          userId,
          reason,
          statusCode: accountStatusCode,
          effectiveFrom: new Date(),
        },
      });
    });
  }
}
