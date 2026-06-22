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
    const trip = await this.prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          name: payload.name,
          dateFrom: payload.dateFrom,
          dateTo: payload.dateTo,
          preferredMembers: payload.preferredMembers,
          inviteCode: payload.inviteCode,
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

      await tx.tripMember.create({
        data: {
          userId: trip.createdBy,
          tripId: trip.id,
          roleCode: TripMemberRole.ADMIN,
        },
      });
      return trip;
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

  async getCandidateTrips(tripId: string): Promise<TripForMatchingDTO[]> {
    const trips = await this.prisma.trip.findMany({
      where: {
        id: {
          not: tripId,
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
    console.log(tripId, page, limit);

    const [matches, total] = await Promise.all([
      this.prisma.tripMatch.findMany({
        where: {
          OR: [{ tripAId: tripId }, { tripBId: tripId }],
          connectionRequest: {
            none: {
              statusCode: 'accepted',
            },
          },
        },

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
        where: {
          OR: [{ tripAId: tripId }, { tripBId: tripId }],
        },
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
        statusCode: TripStatus.UPCOMING,
      },
      include: {
        destination: {
          include: {
            country: true,
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
}
