import { Prisma, PrismaClient, User as PrismaUser } from '@prisma/client';
import { BaseRepository } from './base.repository';

import {
  IUserRepository,
  CreateUserData,
  UpdateLocationData,
} from '../../../application/interfaces/repositories/user.reposetory';

import { User } from '../../../domain/entities/user/user.entity';

import { GetAllUsersRequestDTO } from '../../../application/dtos/user-management/request/get-users.dto';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ChangeUserStatusRequestDTO } from '../../../application/dtos/user-management/request/change-status.dto';
import { AccountStatus, OnlineStatus } from '../../../domain/enums';
import { OnboardingSourceRequestDTO } from '../../../application/dtos/onbaording/request/source.dto';
import {
  AlreadyRequestSentError,
  ConnectionAlreadyExistError,
  UserLocationDataMissingError,
} from '../../../domain/errors/user.error';
import {
  UserCardDetailsResponseDTO,
  UserWithDetails,
} from '../../../application/dtos/users/response/user-card.dto';
import { calculateAge } from '../../../shared/helpers/calculateAge';
import { NearbyUsersResponseDTO } from '../../../application/dtos/users/response/nearby-users.dto';
import { GetUserProfileResponseDTO } from '../../../application/dtos/users/response/user-profile.dto';
import { UserNotFoundError } from '../../../domain/errors/auth.error';
import { SendConnectionRequestDTO } from '../../../application/dtos/connections/requests/send-connection-request.dto';
import { GetIncomingRequestsResponseDTO } from '../../../application/dtos/connections/response/get-requests.dto';
import { GetConnectionsResponseDTO } from '../../../application/dtos/connections/response/get-connections.dto';
import { UpdateSettingsRequestDTO } from '../../../application/dtos/profile/request/settings-update.dto';
import { GetSettingsResponseDTO } from '../../../application/dtos/profile/response/get-settings.dto';
import { GetAllRequestsResponseDTO } from '../../../application/dtos/connections/response/get-all-requests.dto';
import { GetSentRequestsResponseDTO } from '../../../application/dtos/connections/response/get-sent-requests.dto';
import { UserMapper } from '../mappers/user.mapper';
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

  private async findUser(
    where: Prisma.UserWhereInput,
    include?: object,
  ): Promise<User | null> {
    const result = await this.findFirst(
      {
        ...where,
        deletedAt: null,
      },
      include,
    );
    if (!result) return null;

    return UserMapper.toDomain(result);
  }

  async findUserById(id: string, include?: object): Promise<User | null> {
    return this.findUser(
      {
        id,
      },
      include,
    );
  }

  async findByEmail(email: string, include?: object): Promise<User | null> {
    return this.findUser(
      {
        email,
      },
      include,
    );
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName: data.fullName,

          email: data.email,

          passwordHash: data.passwordHash,

          ...(data.isEmailVerified && {
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
        orderBy: { [safeSortBy]: sortOrder },
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

  async addUserOnboardingSource(
    payload: OnboardingSourceRequestDTO,
  ): Promise<void> {
    console.log(payload.source.length);
    const codes = await this.prisma.onboardingSource.findMany();
    console.log(codes);
    await this.prisma.userOnboarding.create({
      data: {
        onboardingSourceCode: payload.source,
        userId: payload.userId,
        onboardingStep: 1,
        onboardingCompleted: false,
      },
    });
  }

  async updateUser(userId: string, payload: object): Promise<void> {
    await super.update({ id: userId }, payload);
  }
  async createSkills(userId: string, skills: string[]): Promise<void> {
    for (const skill of skills) {
      await this.prisma.userSkill.create({
        data: {
          skill,
          userId,
        },
      });
    }
  }
  async createLanguages(userId: string, languages: string[]): Promise<void> {
    for (const language of languages) {
      await this.prisma.userLanguage.create({
        data: {
          language,
          userId,
        },
      });
    }
  }

  async createTravelInterests(
    userId: string,
    interests: string[],
  ): Promise<void> {
    for (const interest of interests) {
      await this.prisma.userInterest.create({
        data: {
          interest,
          userId,
        },
      });
    }
  }

  async updateOnboarding(userId: string, payload: object): Promise<void> {
    await this.prisma.userOnboarding.update({
      where: { userId },
      data: payload,
    });
  }

  async updateUserLocation(payload: UpdateLocationData): Promise<void> {
    await this.prisma.userLocation.upsert({
      where: {
        userId: payload.userId,
      },
      create: {
        userId: payload.userId,
        currentLat: payload.latitude,
        currentLng: payload.longitude,
        currentCity: payload.city,
        currentCountryCode: payload.countryCode,
        lastSeenAt: new Date(),
        onlineStatusCode: OnlineStatus.ONLINE,
      },
      update: {
        currentLat: payload.latitude,
        currentLng: payload.longitude,
        currentCity: payload.city,
        currentCountryCode: payload.countryCode,
        lastSeenAt: new Date(),
        onlineStatusCode: OnlineStatus.ONLINE,
      },
    });
  }
  async getUserLocation(
    userId: string,
  ): Promise<{ lat: number; lang: number }> {
    const userLocation = await this.prisma.userLocation.findFirst({
      where: { userId },
      select: { currentLat: true, currentLng: true },
    });
    if (!userLocation) {
      throw new UserLocationDataMissingError();
    }
    const { currentLat, currentLng } = userLocation;
    if (!currentLat || !currentLng) {
      throw new UserLocationDataMissingError();
    }
    return { lat: currentLat?.toNumber(), lang: currentLng?.toNumber() };
  }

  async getUsersForCard(
    currentUserId: string,
    params: { page: number; limit: number },
  ): Promise<UserCardDetailsResponseDTO> {
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          deletedAt: null,
          id: {
            not: currentUserId,
          },
          onboarding: {
            onboardingCompleted: true,
          },
          accountStatusCode: AccountStatus.ACTIVE,
        },
        include: {
          location: {
            include: {
              onlineStatus: true,
              currentCountry: true,
            },
          },
          country: true,
          travelType: true,
          travelPersonality: true,
          interests: true,
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),

      this.prisma.user.count({
        where: {
          deletedAt: null,
          id: {
            not: currentUserId,
          },
          onboarding: {
            onboardingCompleted: true,
          },
          accountStatusCode: AccountStatus.ACTIVE,
        },
      }),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
        city: user.city ?? null,
        state: user.state ?? null,
        country: user.country?.name ?? null,
        travelType: user.travelType?.code ?? null,
        travelPersonality: user.travelPersonality?.code ?? null,
        interests: user.interests.map((i) => i.interest),
      })),
      limit: params.limit,
      page: params.page,
      total,
      totalPages: Math.ceil(total / params.limit),
    };
  }

  async getNearbyUsers(
    currentUserId: string,
    page: number,
    limit: number,
    radiusKm = 50,
  ): Promise<NearbyUsersResponseDTO> {
    const offset = (page - 1) * limit;

    const currentUserLocation = await this.prisma.userLocation.findUnique({
      where: {
        userId: currentUserId,
      },
    });

    if (!currentUserLocation?.currentLat || !currentUserLocation?.currentLng) {
      return {
        users: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const latitude = Number(currentUserLocation.currentLat);
    const longitude = Number(currentUserLocation.currentLng);
    const users = await this.prisma.$queryRaw<UserWithDetails[]>`
      SELECT
        u.id,
        u.full_name AS "fullName",
        u.avatar_url AS "avatarUrl",
        u.cover_url AS "coverUrl",
        EXTRACT(
          YEAR FROM AGE(
            CURRENT_DATE,
            u.date_of_birth
          )
        )::int AS age,
        u.origin_city AS city,
        u.origin_region AS state,
        c.name AS country,
        tt.code AS "travelType",
        tp.code AS "travelPersonality",
        COALESCE(
          ARRAY_AGG(
            DISTINCT ui.interest
          ) FILTER (
            WHERE ui.interest IS NOT NULL
          ),
          '{}'
        ) AS interests,
        ROUND(
          (
            ST_Distance(
              ul.coordinates,

              ST_SetSRID(
                ST_MakePoint(
                  ${longitude},
                  ${latitude}
                ),
                4326
              )::geography
            ) / 1000
          )::numeric,
          1
        ) AS "distanceKm"
      FROM users u
      INNER JOIN user_locations ul
        ON ul.user_id = u.id
      INNER JOIN user_onboarding uo
        ON uo.user_id = u.id
      LEFT JOIN countries c
        ON c.code =
        u.country_code
      LEFT JOIN travel_types tt
        ON tt.code =
        u.travel_type_code
      LEFT JOIN travel_personalities tp
        ON tp.code =
        u.travel_personality_code
      LEFT JOIN user_interests ui
        ON ui.user_id = u.id

      WHERE
        u.id <> ${currentUserId}
        AND u.deleted_at IS NULL
        AND u.account_status_code = 'active'
        AND uo.onboarding_completed = true
        AND ul.coordinates IS NOT NULL
        AND ST_DWithin(
          ul.coordinates,
          ST_SetSRID(
            ST_MakePoint(
              ${longitude},
              ${latitude}
            ),
            4326
          )::geography,
          ${radiusKm * 1000}
        )

      GROUP BY
        u.id,
        u.full_name,
        u.avatar_url,
        u.cover_url,
        u.date_of_birth,
        ul.current_city,
        c.name,
        tt.code,
        tp.code,
        ul.coordinates
      ORDER BY
        "distanceKm"
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    console.log(users, limit, offset);

    const totalResult = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM users u
      INNER JOIN user_locations ul
        ON ul.user_id = u.id
      INNER JOIN user_onboarding uo
        ON uo.user_id = u.id
      WHERE
        u.id <> ${currentUserId}
        AND u.deleted_at IS NULL
        AND u.account_status_code = 'active'
        AND uo.onboarding_completed = true
        AND ul.coordinates IS NOT NULL
        AND ST_DWithin(
          ul.coordinates,
          ST_SetSRID(
            ST_MakePoint(
              ${longitude},
              ${latitude}
            ),
            4326
          )::geography,
          ${radiusKm * 1000}
        )
    `;

    return {
      users,
      total: Number(totalResult[0]?.count ?? 0),
      page,
      limit,
      totalPages: Math.ceil(Number(totalResult[0]?.count ?? 0) / limit),
    };
  }

  async getUserWithDetails(userId: string): Promise<GetUserProfileResponseDTO> {
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        id: userId,
      },
      include: {
        location: {
          include: {
            onlineStatus: true,
            currentCountry: true,
          },
        },
        country: true,
        travelType: true,
        travelPersonality: true,
        interests: true,
        languages: true,
        skills: true,
        onboarding: true,
      },
    });
    const tripCount = await this.prisma.tripGroup.count({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
    const connectionsCount = await this.prisma.connection.count({
      where: {
        isActive: true,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });
    if (!user) {
      throw new UserNotFoundError();
    }
    return {
      id: user.id,
      status: user.accountStatusCode,
      fullName: user.fullName,
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
      gender: user.genderCode,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
      city: user.city ?? null,
      state: user.state ?? null,
      isEmailVerified: user.isEmailVerified,
      country: user.country?.name ?? null,
      travelType: user.travelType?.code ?? null,
      travelPersonality: user.travelPersonality?.code ?? null,
      interests: user.interests.map((i) => i.interest),
      languages: user.languages.map((i) => i.language),
      skills: user.skills.map((i) => i.skill),
      createdAt: user.createdAt,
      isTraveling: user.isTraveling,
      dob: user.dateOfBirth!,
      onboardingCompleted: user.onboarding!.onboardingCompleted,
      onboardingSource: user.onboarding!.onboardingSourceCode,
      onboardingStep: user.onboarding!.onboardingStep,
      matchWith: user.matchWithCode!,
      tripCount,
      connectionsCount,
    };
  }

  async sendConnectionRequest(
    payload: SendConnectionRequestDTO,
  ): Promise<void> {
    const existing = await this.prisma.connectionRequest.findFirst({
      where: {
        OR: [
          {
            senderId: payload.senderId,
            receiverId: payload.receiverId,
          },
          {
            senderId: payload.receiverId,
            receiverId: payload.senderId,
          },
        ],
      },
    });
    const connection = await this.prisma.connection.findFirst({
      where: {
        isActive: true,
        OR: [
          {
            userAId: payload.senderId,
            userBId: payload.receiverId,
          },
          {
            userAId: payload.receiverId,
            userBId: payload.senderId,
          },
        ],
      },
    });
    console.log(existing);
    if (existing?.id) {
      if (existing.statusCode == 'pending') {
        throw new AlreadyRequestSentError();
      } else if (
        existing.statusCode == 'cancelled' ||
        existing.statusCode == 'rejected'
      )
        await this.prisma.connectionRequest.update({
          where: {
            id: existing.id,
          },
          data: {
            senderId: payload.senderId,
            receiverId: payload.receiverId,
            matchId: payload.matchId,
            message: payload.message,
            statusCode: 'pending',
            respondedAt: null,
            createdAt: new Date(),
          },
        });
      return;
    }
    if (connection?.id) {
      throw new ConnectionAlreadyExistError();
    }
    await this.prisma.connectionRequest.create({
      data: {
        matchId: payload.matchId,
        receiverId: payload.receiverId,
        message: payload.message,
        senderId: payload.senderId,
      },
    });
  }
  async getIncomingConnectionRequests(
    userId: string,
  ): Promise<GetIncomingRequestsResponseDTO> {
    const requests = await this.prisma.connectionRequest.findMany({
      where: {
        receiverId: userId,
        statusCode: 'pending',
      },
      include: {
        sender: {
          include: {
            country: true,
          },
        },
      },
    });
    return {
      requests: requests.map((req) => {
        return {
          id: req.id,
          message: req.message,
          matchId: req.matchId,
          sender: {
            id: req.sender.id,
            fullName: req.sender.fullName,
            avatarUrl: req.sender.avatarUrl,
            country: req.sender.country?.name ?? null,
            state: req.sender.state,
          },
          createdAt: req.createdAt,
          status: req.statusCode,
        };
      }),
    };
  }

  async getUserRequests(userId: string): Promise<GetAllRequestsResponseDTO> {
    const requests = await this.prisma.connectionRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        statusCode: 'pending',
      },
    });
    return {
      requests: requests.map((req) => ({
        id: req.id,
        receiverId: req.receiverId,
        senderId: req.senderId,
      })),
    };
  }

  async getSentRequests(userId: string): Promise<GetSentRequestsResponseDTO> {
    const requests = await this.prisma.connectionRequest.findMany({
      where: {
        senderId: userId,
        statusCode: 'pending',
      },
      include: {
        receiver: {
          include: {
            country: true,
          },
        },
      },
    });
    return {
      requests: requests.map((req) => {
        return {
          id: req.id,
          message: req.message,
          matchId: req.matchId,
          receiver: {
            id: req.receiver.id,
            fullName: req.receiver.fullName,
            avatarUrl: req.receiver.avatarUrl,
            country: req.receiver.country?.name ?? null,
            state: req.receiver.state,
          },
          createdAt: req.createdAt,
          status: req.statusCode,
        };
      }),
    };
  }

  async updateRequestStatus(payload: {
    requestId: string;
    status: string;
  }): Promise<void> {
    if (payload.status == 'accepted') {
      await this.prisma.$transaction(async (tx) => {
        const request = await tx.connectionRequest.update({
          where: {
            id: payload.requestId,
          },
          data: {
            statusCode: 'accepted',
            respondedAt: new Date(),
          },
        });

        await tx.connection.create({
          data: {
            userAId: request.senderId,
            userBId: request.receiverId,
            requestId: request.id,
          },
        });
      });
    } else {
      await this.prisma.connectionRequest.update({
        where: {
          id: payload.requestId,
        },
        data: {
          statusCode: payload.status,
          respondedAt: new Date(),
        },
      });
    }
  }
  async getUserConnections(userId: string): Promise<GetConnectionsResponseDTO> {
    const connections = await this.prisma.connection.findMany({
      where: {
        isActive: true,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            state: true,
            country: {
              select: {
                name: true,
              },
            },
          },
        },
        userB: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            state: true,
            country: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return {
      connections: connections.map((connection) => {
        const otherUser =
          connection.userAId === userId ? connection.userB : connection.userA;
        return {
          id: connection.id,
          userId: otherUser.id,
          fullName: otherUser.fullName,
          avatarUrl: otherUser.avatarUrl,
          country: otherUser.country?.name ?? null,
          state: otherUser.state,
        };
      }),
    };
  }

  async deactivateConnection(connectionId: string): Promise<void> {
    await this.prisma.connection.update({
      where: {
        id: connectionId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async updateSettings(
    userId: string,
    payload: UpdateSettingsRequestDTO,
  ): Promise<void> {
    await this.prisma.userPrivacy.update({
      where: {
        userId,
      },
      data: payload,
    });
  }

  async getSettings(userId: string): Promise<GetSettingsResponseDTO> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        phone: true,
        isPhoneVerified: true,
      },
    });
    const result = await this.prisma.userPrivacy.findFirst({
      where: {
        userId,
      },
    });
    if (!result) {
      throw new Error('Settings not found');
    }
    return {
      profileVisibilityCode: result.profileVisibilityCode!,
      requestsFromCode: result.requestsFromCode!,
      showOnlineStatus: result.showOnlineStatus,
      showTravelingStatus: result.showTravelingStatus,
      phone: user!.phone,
      isPhoneVerified: user!.isPhoneVerified,
    };
  }

  async deleteInterests(userId: string): Promise<void> {
    await this.prisma.userInterest.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteLanguages(userId: string): Promise<void> {
    await this.prisma.userLanguage.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteSkills(userId: string): Promise<void> {
    await this.prisma.userSkill.deleteMany({
      where: {
        userId,
      },
    });
  }

  async verifyPhone(userId: string, phone: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        phone,
        isPhoneVerified: true,
        phoneVerifiedAt: new Date(),
      },
    });
  }
  async findUserByPhone(
    phone: string,
  ): Promise<{ id: string; isPhoneVerified: boolean } | null> {
    return await this.prisma.user.findFirst({
      where: {
        phone,
      },
      select: {
        id: true,
        isPhoneVerified: true,
      },
    });
  }
}
