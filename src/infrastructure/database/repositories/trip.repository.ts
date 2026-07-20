import { inject, injectable } from 'tsyringe';
import { Trip, Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { TOKENS } from '../../di/tokens';
import { ITripRepository } from '../../../application/interfaces/repositories/trip.repository';
import {
  CreateDestinationRequestDTO,
  Destination,
} from '../../../application/dtos/trip/request/destination.dto';
import { CreateTripDataDTO } from '../../../application/dtos/trip/request/create-trip.dto';
import {
  TripMemberRole,
  TripStatus,
} from '../../../domain/enums/trip.constants';
import {
  SaveTripMatchDTO,
  TripForMatchingDTO,
} from '../../../application/dtos/trip/responce/calculate-mathc.dto';
import { TripMatchResponseDTO } from '../../../application/dtos/trip/responce/get-matches.dto';
import { calculateAge } from '../../../shared/helpers/calculateAge';
import { GetActiveTripResponseDTO } from '../../../application/dtos/trip/responce/get-active-trip.dto';
import { GetUserTripsResponseDTO } from '../../../application/dtos/trip/responce/get-user-trips.dto';
import {
  GetMatchProfileResponseDTO,
  MatchExplanation,
} from '../../../application/dtos/trip/responce/get-match-profile.dto';
import { EditTripData } from '../../../application/dtos/trip/request/edit-trip.dto';
import { GroupData } from '../../../application/dtos/trip/responce/get-groups.dto';
import { GetMembersResponseDTO } from '../../../application/dtos/trip/responce/get-members.dto';
import {
  GroupNotFound,
  OnlyAdminCanRemoveError,
  UserAlreadyExistInTheGroupError,
} from '../../../domain/errors/trip.error';
import {
  GetGroupInvitesResponse,
  GroupInvite,
} from '../../../application/dtos/trip/responce/get-invites.dto';
import { id } from 'zod/v4/locales';
import { TripDestination } from '../../../application/dtos/trip/responce/get-weather.dto';

@injectable()
export class TripRepository
  extends BaseRepository<Trip, Prisma.TripCreateInput, Prisma.TripUpdateInput>
  implements ITripRepository
{
  constructor(@inject(TOKENS.PrismaClient) prisma: PrismaClient) {
    super(prisma, prisma.trip);
  }
  async findDestinationByPlaceId(placeId: string): Promise<Destination | null> {
    const result = await this.prisma.destination.findFirst({
      where: {
        placeId,
      },
    });
    if (!result) {
      return null;
    }
    return {
      ...result,
      latitude: Number(result?.latitude),
      longitude: Number(result?.longitude),
    };
  }
  async createTrip(payload: CreateTripDataDTO): Promise<{ tripId: string }> {
    const trip = await this.prisma.trip.create({
      data: {
        name: payload.name,
        dateFrom: payload.dateFrom,
        dateTo: payload.dateTo,
        destination: {
          connect: {
            id: payload.destinationId,
          },
        },
        creator: {
          connect: {
            id: payload.createdBy,
          },
        },
        budgetStyle: {
          connect: {
            code: payload.budgetStyle,
          },
        },
        travelStyle: {
          connect: {
            code: payload.travelStyleCode,
          },
        },
      },
    });

    return { tripId: trip.id };
  }
  async createDestination(
    payload: CreateDestinationRequestDTO,
  ): Promise<Destination> {
    const result = await this.prisma.destination.create({
      data: {
        ...payload,
      },
    });
    return {
      ...result,
      latitude: Number(result?.latitude),
      longitude: Number(result?.longitude),
    };
  }

  async getCandidateTrips(
    tripId: string,
    userId: string,
  ): Promise<TripForMatchingDTO[]> {
    const trips = await this.prisma.trip.findMany({
      where: {
        id: {
          not: tripId,
        },
        createdBy: {
          not: userId,
        },
        statusCode: TripStatus.UPCOMING,
      },
      include: {
        destination: {
          include: {
            country: true,
          },
        },
        creator: {
          include: {
            interests: true,
            languages: true,
            travelPersonality: true,
          },
        },
      },
    });
    return trips.map((trip) => ({
      id: trip.id,

      destinationId: trip.destinationId,

      dateFrom: trip.dateFrom,
      dateTo: trip.dateTo,

      budgetStyleCode: trip.budgetStyleCode,
      travelStyleCode: trip.travelStyleCode,

      destination: {
        id: trip.destination.id,
        name: trip.destination.name,
        city: trip.destination.city,
        state: trip.destination.state,
        country: trip.destination.country.name,
        latitude: Number(trip.destination.latitude),
        longitude: Number(trip.destination.longitude),
        coverUrl: trip.destination.coverUrl,
      },

      creator: {
        id: trip.creator.id,
        travelPersonalityCode: trip.creator.travelPersonalityCode,
        interests: trip.creator.interests.map((interest) => ({
          interestCode: interest.interest,
        })),
        languages: trip.creator.languages.map((language) => ({
          languageCode: language.language,
        })),
      },
    }));
  }
  async getTripForMatching(tripId: string): Promise<TripForMatchingDTO> {
    const trip = await this.prisma.trip.findUnique({
      where: {
        id: tripId,
      },

      include: {
        destination: {
          include: {
            country: true,
          },
        },

        creator: {
          include: {
            interests: true,
            languages: true,
            travelPersonality: true,
          },
        },
      },
    });

    if (!trip) {
      throw new Error('trip not found');
    }

    return {
      id: trip.id,

      destinationId: trip.destinationId,

      dateFrom: trip.dateFrom,
      dateTo: trip.dateTo,

      budgetStyleCode: trip.budgetStyleCode,
      travelStyleCode: trip.travelStyleCode,

      destination: {
        id: trip.destination.id,
        name: trip.destination.name,
        city: trip.destination.city,
        state: trip.destination.state,
        country: trip.destination.country.name,
        latitude: Number(trip.destination.latitude),
        longitude: Number(trip.destination.longitude),
        coverUrl: trip.destination.coverUrl,
      },

      creator: {
        id: trip.creator.id,
        travelPersonalityCode: trip.creator.travelPersonalityCode,
        interests: trip.creator.interests.map((interest) => ({
          interestCode: interest.interest,
        })),
        languages: trip.creator.languages.map((language) => ({
          languageCode: language.language,
        })),
      },
    };
  }

  async saveTripMatch(payload: SaveTripMatchDTO): Promise<void> {
    await this.prisma.tripMatch.upsert({
      where: {
        tripAId_tripBId: {
          tripAId: payload.sourceTripId,
          tripBId: payload.targetTripId,
        },
      },
      create: {
        tripAId: payload.sourceTripId,
        tripBId: payload.targetTripId,
        destinationScore: payload.destinationScore,
        budgetScore: payload.budgetScore,
        dateScore: payload.dateScore,
        interestScore: payload.interestScore,
        languageScore: payload.languageScore,
        personalityScore: payload.personalityScore,
        travelStyleScore: payload.travelStyleScore,
        totalScore: payload.totalScore,
        explanation: payload.explanation,
      },
      update: {
        destinationScore: payload.destinationScore,
        dateScore: payload.dateScore,
        travelStyleScore: payload.travelStyleScore,
        budgetScore: payload.budgetScore,
        personalityScore: payload.personalityScore,
        interestScore: payload.interestScore,
        totalScore: payload.totalScore,
        explanation: payload.explanation,
        calculatedAt: new Date(),
      },
    });
  }

  async deleteTripMatch(payload: { tripId: string }): Promise<void> {
    await this.prisma.tripMatch.deleteMany({
      where: {
        OR: [{ tripAId: payload.tripId }, { tripBId: payload.tripId }],
      },
    });
  }

  async getTripMatches(
    tripId: string,
    page: number,
    limit: number,
  ): Promise<TripMatchResponseDTO> {
    const skip = (page - 1) * limit;
    const where = {
      OR: [
        {
          tripAId: tripId,
          tripB: {
            statusCode: TripStatus.UPCOMING,
            dateTo: {
              gte: new Date(),
            },
          },
        },
        {
          tripBId: tripId,
          tripA: {
            statusCode: TripStatus.UPCOMING,
            dateTo: {
              gte: new Date(),
            },
          },
        },
      ],

      connectionRequest: {
        none: {
          statusCode: 'accepted',
        },
      },
    };
    const [matches, total] = await Promise.all([
      this.prisma.tripMatch.findMany({
        where,

        orderBy: {
          totalScore: 'desc',
        },

        skip,
        take: limit,

        include: {
          tripA: {
            include: {
              destination: true,

              creator: {
                include: {
                  interests: true,
                  languages: true,
                  travelPersonality: true,
                  country: true,
                },
              },
            },
          },

          tripB: {
            include: {
              destination: true,

              creator: {
                include: {
                  interests: true,
                  languages: true,
                  travelPersonality: true,
                  country: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.tripMatch.count({
        where,
      }),
    ]);
    return {
      matches: matches.map((match) => {
        const matchedTrip =
          match.tripAId === tripId ? match.tripB : match.tripA;
        return {
          user: {
            id: matchedTrip.creator.id,
            fullName: matchedTrip.creator.fullName,
            age: calculateAge(matchedTrip.creator.dateOfBirth!),
            avatarUrl: matchedTrip.creator.avatarUrl,
            city: matchedTrip.creator.city,
            country: matchedTrip.creator.country?.name ?? null,
            state: matchedTrip.creator.state,
            coverUrl: matchedTrip.creator.coverUrl,
            interests: matchedTrip.creator.interests.map(
              (interest) => interest.interest,
            ),
            travelPersonality: matchedTrip.creator.travelPersonalityCode,
          },
          tripMatch: {
            id: match.id,
            matchedTripId: matchedTrip.id,
            destination: matchedTrip.destination.name.split(',')[0],
            dateFrom: matchedTrip.dateFrom,
            dateTo: matchedTrip.dateTo,
            totalPoints: match.totalScore,
          },
        };
      }),
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getActiveTrip(payload: {
    userId: string;
  }): Promise<GetActiveTripResponseDTO | null> {
    const trip = await this.prisma.trip.findFirst({
      where: {
        createdBy: payload.userId,
        statusCode: TripStatus.UPCOMING,
        dateTo: {
          gte: new Date(),
        },
      },
      orderBy: {
        dateFrom: 'asc',
      },
      include: {
        destination: {
          include: {
            country: true,
          },
        },
      },
    });
    if (!trip) {
      return null;
    }
    return {
      id: trip?.id,
      destinationId: trip.destinationId,
      name: trip.name,
      destination: {
        id: trip.destination.id,
        city: trip.destination.city,
        country: trip.destination.country.name,
        latitude: Number(trip.destination.latitude),
        longitude: Number(trip.destination.longitude),
        name: trip.destination.name,
        state: trip.destination.state,
        coverUrl: trip.destination.coverUrl,
      },
      budgetStyleCode: trip.budgetStyleCode,
      dateFrom: trip.dateFrom,
      dateTo: trip.dateTo,
      travelStyleCode: trip.travelStyleCode,
    };
  }

  async getUserUpcomingTrips(payload: {
    userId: string;
  }): Promise<GetUserTripsResponseDTO> {
    const trips = await this.prisma.trip.findMany({
      where: {
        createdBy: payload.userId,
        dateTo: {
          gte: new Date(),
        },
        statusCode: { not: TripStatus.CANCELLED },
      },
      include: {
        destination: {
          include: {
            country: true,
          },
        },
        group: {
          select: {
            id: true,
          },
        },
      },
    });
    return {
      trips: trips.map((trip) => {
        return {
          id: trip.id,
          name: trip.name,
          dateFrom: trip.dateFrom,
          dateTo: trip.dateTo,
          destination: {
            id: trip.destination.id,
            city: trip.destination.city,
            country: trip.destination.country.name,
            latitude: Number(trip.destination.latitude),
            longitude: Number(trip.destination.longitude),
            name: trip.destination.name,
            state: trip.destination.state,
            coverUrl: trip.destination.coverUrl,
          },
          budgetStyleCode: trip.budgetStyleCode,
          destinationId: trip.destinationId,
          travelStyleCode: trip.travelStyleCode,
          group: trip.group ? { id: trip.group.id } : null,
        };
      }),
    };
  }
  async getMatchProfile(payload: {
    matchId: string;
    userId: string;
  }): Promise<GetMatchProfileResponseDTO> {
    const match = await this.prisma.tripMatch.findFirst({
      where: {
        id: payload.matchId,
      },
      include: {
        tripA: {
          include: {
            destination: {
              include: {
                country: true,
              },
            },

            creator: {
              include: {
                interests: true,
                languages: true,
                skills: true,
                country: true,
              },
            },
          },
        },

        tripB: {
          include: {
            destination: {
              include: {
                country: true,
              },
            },

            creator: {
              include: {
                interests: true,
                languages: true,
                skills: true,
                country: true,
              },
            },
          },
        },
      },
    });
    if (!match) {
      throw new Error('no match found');
    }

    const matchedTrip =
      match?.tripA.createdBy == payload.userId ? match?.tripB : match?.tripA;
    const explanation = match.explanation as unknown as MatchExplanation;
    return {
      match: {
        id: match?.id,
        explanation: explanation,
        totalPoints: match?.totalScore,
      },
      matchedTrip: {
        id: matchedTrip?.id,
        name: matchedTrip?.name,
        budgetStyle: matchedTrip?.budgetStyleCode,
        dateFrom: matchedTrip?.dateFrom,
        dateTo: matchedTrip?.dateTo,
        travelStyle: matchedTrip.travelStyleCode,
        destination: {
          id: matchedTrip?.destination.id,
          name: matchedTrip?.destination.name,
          coverUrl: matchedTrip?.destination.coverUrl,
          city: matchedTrip?.destination.city,
          country: matchedTrip?.destination.country.name,
          state: matchedTrip?.destination.state,
        },
      },
      user: {
        id: matchedTrip?.creator.id,
        fullName: matchedTrip.creator.fullName,
        age: calculateAge(matchedTrip.creator.dateOfBirth!),
        avatarUrl: matchedTrip.creator.avatarUrl,
        bio: matchedTrip.creator.bio,
        city: matchedTrip.creator.city,
        country: matchedTrip.creator.country?.name ?? null,
        coverUrl: matchedTrip.creator.coverUrl,
        travelPersonality: matchedTrip.creator.travelPersonalityCode,
        travelType: matchedTrip.creator.travelTypeCode,
        state: matchedTrip.creator.state,
        createdAt: matchedTrip.creator.createdAt,
        interests: matchedTrip.creator.interests.map(
          (interest) => interest.interest,
        ),
        languages: matchedTrip.creator.languages.map((lang) => lang.language),
        skills: matchedTrip.creator.skills.map((skill) => skill.skill),
      },
    };
  }
  async getUserPastTrips(payload: {
    userId: string;
  }): Promise<GetUserTripsResponseDTO> {
    const trips = await this.prisma.trip.findMany({
      where: {
        createdBy: payload.userId,
        statusCode: { not: TripStatus.CANCELLED },
        dateTo: {
          lt: new Date(),
        },
      },
      include: {
        destination: {
          include: {
            country: true,
          },
        },
        group: {
          select: {
            id: true,
          },
        },
      },
    });
    return {
      trips: trips.map((trip) => {
        return {
          id: trip.id,
          name: trip.name,
          dateFrom: trip.dateFrom,
          dateTo: trip.dateTo,
          destination: {
            id: trip.destination.id,
            city: trip.destination.city,
            country: trip.destination.country.name,
            latitude: Number(trip.destination.latitude),
            longitude: Number(trip.destination.longitude),
            name: trip.destination.name,
            state: trip.destination.state,
            coverUrl: trip.destination.coverUrl,
          },
          budgetStyleCode: trip.budgetStyleCode,
          destinationId: trip.destinationId,
          travelStyleCode: trip.travelStyleCode,
          group: trip.group ? { id: trip.group.id } : null,
        };
      }),
    };
  }
  async editTrip(tripId: string, payload: EditTripData): Promise<void> {
    await this.prisma.trip.update({
      where: {
        id: tripId,
      },
      data: payload,
    });
  }
  async createGroup(
    tripId: string,
    userId: string,
    inviteCode: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const group = await tx.tripGroup.create({
        data: {
          tripId,
          createdBy: userId,
          inviteCode,
        },
      });
      await tx.tripGroupMember.create({
        data: {
          groupId: group.id,
          userId,
          roleCode: TripMemberRole.ADMIN,
        },
      });
    });
  }
  async getActiveGroups(userId: string): Promise<GroupData[]> {
    const groups = await this.prisma.tripGroup.findMany({
      where: {
        members: {
          some: {
            userId,
            isActive: true,
          },
        },
        trip: {
          dateTo: { gte: new Date() },
        },
      },
      orderBy: {
        trip: {
          dateFrom: 'asc',
        },
      },
      include: {
        trip: {
          include: {
            destination: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                avatarUrl: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
    return groups.map((group) => {
      return {
        id: group.id,
        name: group.trip.name,
        dateFrom: group.trip.dateFrom,
        dateTo: group.trip.dateTo,
        destination: group.trip.destination.name,
        coverUrl: group.trip.destination.coverUrl!,
        budgetStyle: group.trip.budgetStyleCode,
        members: group.members.map((m) => ({
          id: m.user.id,
          name: m.user.fullName,
          avatarUrl: m.user.avatarUrl!,
        })),
      };
    });
  }
  async addMember(
    userId: string,
    groupId: string,
    addedBy: string,
  ): Promise<void> {
    const isExist = await this.prisma.tripGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
    if (isExist) {
      if (isExist?.isActive) {
        throw new UserAlreadyExistInTheGroupError();
      }
      if (!isExist?.isActive) {
        await this.prisma.tripGroupMember.update({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
          data: {
            isActive: true,
          },
        });
        return;
      }
    }

    await this.prisma.tripGroupMember.create({
      data: {
        userId,
        groupId,
        addedBy,
      },
    });
  }
  async getMembers(groupId: string): Promise<GetMembersResponseDTO> {
    const members = await this.prisma.tripGroupMember.findMany({
      where: {
        groupId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });
    return {
      members: members.map((m) => ({
        id: m.id,
        name: m.user.fullName,
        userId: m.user.id,
        avatarUrl: m.user.avatarUrl!,
        joinedAt: m.joinedAt,
        role: m.roleCode,
      })),
    };
  }
  async getInviteCode(groupId: string): Promise<{ inviteCode: string }> {
    const group = await this.prisma.tripGroup.findFirst({
      where: {
        id: groupId,
      },
    });
    if (!group) {
      throw new GroupNotFound();
    }
    return { inviteCode: group.inviteCode };
  }
  async getGroupWithTrip(groupId: string): Promise<{
    inviteCode: string;
    groupName: string;
    destination: string;
  }> {
    const group = await this.prisma.tripGroup.findFirst({
      where: {
        id: groupId,
      },
      include: {
        trip: {
          include: {
            destination: true,
          },
        },
      },
    });
    if (!group) {
      throw new GroupNotFound();
    }
    return {
      inviteCode: group.inviteCode,
      groupName: group.trip.name,
      destination: group.trip.destination.name,
    };
  }
  async joinGroupByInviteCode(payload: {
    inviteCode: string;
    userId: string;
  }): Promise<{ groupId: string; alreadyMember: boolean }> {
    const group = await this.prisma.tripGroup.findUnique({
      where: {
        inviteCode: payload.inviteCode,
      },
      select: {
        id: true,
      },
    });

    if (!group) {
      throw new Error('invalid invite link');
    }

    const existingMember = await this.prisma.tripGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: payload.userId,
        },
      },
    });

    await this.prisma.$transaction(async (tx) => {
      if (!existingMember) {
        await tx.tripGroupMember.create({
          data: {
            groupId: group.id,
            userId: payload.userId,
            roleCode: TripMemberRole.MEMBER,
          },
        });
      } else {
        await tx.tripGroupMember.update({
          where: {
            groupId_userId: {
              groupId: group.id,
              userId: payload.userId,
            },
          },
          data: {
            isActive: true,
            leftAt: null,
            roleCode: TripMemberRole.MEMBER,
          },
        });
      }

      const user = await tx.user.findUnique({
        where: { id: payload.userId },
        select: { email: true },
      });

      if (user?.email) {
        await tx.tripGroupInvite.updateMany({
          where: {
            groupId: group.id,
            invitedUserEmail: user.email,
            statusCode: 'pending',
          },
          data: {
            statusCode: 'accepted',
            respondedAt: new Date(),
          },
        });
      }
    });

    return { groupId: group.id, alreadyMember: false };
  }
  async GetGroupWithDetails(groupId: string): Promise<GroupData> {
    const group = await this.prisma.tripGroup.findFirst({
      where: {
        id: groupId,
      },
      include: {
        trip: {
          include: {
            destination: true,
          },
        },
        members: {
          where: {
            isActive: true,
          },
          include: {
            user: {
              select: {
                id: true,
                avatarUrl: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
    if (!group) {
      throw new GroupNotFound();
    }
    return {
      id: group.id,
      name: group.trip.name,
      dateFrom: group.trip.dateFrom,
      dateTo: group.trip.dateTo,
      destination: group.trip.destination.name,
      coverUrl: group.trip.destination.coverUrl!,
      budgetStyle: group.trip.budgetStyleCode,
      members: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.fullName,
        avatarUrl: m.user.avatarUrl!,
      })),
    };
  }
  async createGroupInvite(payload: {
    groupId: string;
    invitedBy: string;
    invitedUserEmail: string;
  }): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.invitedUserEmail,
      },
      select: {
        id: true,
      },
    });
    if (user?.id) {
      const existingMember = await this.prisma.tripGroupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: payload.groupId,
            userId: user.id,
          },
          isActive: true,
        },
      });
      if (existingMember) {
        throw new UserAlreadyExistInTheGroupError();
      }
    }

    const invite = await this.prisma.tripGroupInvite.findFirst({
      where: {
        invitedUserEmail: payload.invitedUserEmail,
        groupId: payload.groupId,
      },
    });
    if (invite?.id) {
      await this.prisma.tripGroupInvite.update({
        where: {
          id: invite.id,
        },
        data: {
          createdAt: new Date(),
        },
      });
    } else {
      await this.prisma.tripGroupInvite.create({
        data: {
          ...payload,
        },
      });
    }
  }
  async getGroupInvites(groupId: string): Promise<GetGroupInvitesResponse> {
    const invites = await this.prisma.tripGroupInvite.findMany({
      where: {
        groupId,
      },
    });
    return {
      invites: invites.map((i) => {
        return {
          id: i.id,
          groupId: i.groupId,
          invitedUserEmail: i.invitedUserEmail!,
          invitedBy: i.invitedBy,
          statusCode: i.statusCode,
          createdAt: i.createdAt,
        };
      }),
    };
  }
  async changeMemberRole(groupId: string, memberId: string): Promise<void> {
    await this.prisma.tripGroupMember.update({
      where: {
        groupId_userId: {
          groupId,
          userId: memberId,
        },
      },
      data: {
        roleCode: TripMemberRole.ADMIN,
      },
    });
  }

  async removeFromGroup(
    groupId: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    if (userId) {
      const user = await this.prisma.tripGroupMember.findFirst({
        where: {
          groupId,
          userId,
          isActive: true,
        },
      });
      if (user?.roleCode !== TripMemberRole.ADMIN) {
        throw new OnlyAdminCanRemoveError();
      }
    }
    await this.prisma.tripGroupMember.update({
      where: {
        groupId_userId: {
          groupId,
          userId: memberId,
        },
      },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });
  }
  async getTripDestination(
    tripGroupId: string,
  ): Promise<TripDestination | null> {
    const tripGroup = await this.prisma.tripGroup.findUnique({
      where: {
        id: tripGroupId,
      },
      select: {
        trip: {
          select: {
            destination: {
              select: {
                id: true,
                latitude: true,
                longitude: true,
                city: true,
                state: true,
                country: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tripGroup) {
      return null;
    }

    const destination = tripGroup.trip.destination;

    return {
      destinationId: destination.id,
      latitude: Number(destination.latitude),
      longitude: Number(destination.longitude),
      city: destination.city ?? '',
      state: destination.state,
      country: destination.country.name,
    };
  }
  async getAllTripGroups(): Promise<GroupData[]> {
    const groups = await this.prisma.tripGroup.findMany({
      include: {
        trip: {
          include: {
            destination: true,
          },
        },
        members: {
          where: {
            isActive: true,
          },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
    return groups.map((group) => ({
      id: group.id,
      name: group.trip.name,
      dateFrom: group.trip.dateFrom,
      dateTo: group.trip.dateTo,
      destination: group.trip.destination.name,
      coverUrl: group.trip.destination.coverUrl!,
      budgetStyle: group.trip.budgetStyleCode,
      members: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.fullName,
      })),
    }));
  }
}
