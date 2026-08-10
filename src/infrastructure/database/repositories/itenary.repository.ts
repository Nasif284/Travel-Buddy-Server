import { inject, injectable } from 'tsyringe';
import { BaseRepository } from './base.repository';
import { ItineraryDay, Prisma, PrismaClient } from '@prisma/client';
import { IItineraryRepository } from '../../../application/interfaces/repositories/itenary.repository';
import { TOKENS } from '../../di/tokens';
import { GroupItineraryRepositoryResponse } from '../../../application/dtos/itenary/response/get-itenary.dto';
import { CreateItineraryDayRequestDTO } from '../../../application/dtos/itenary/request/create-day';
import { CreateItineraryActivityRequestDTO } from '../../../application/dtos/itenary/request/create-activity.dto';
import { UpdateItineraryActivityRequestDTO } from '../../../application/dtos/itenary/request/update-activity.dto';
import { UpdateItineraryDayRequestDTO } from '../../../application/dtos/itenary/request/update-day.dto';
import { GeneratedItinerary } from '../../../application/dtos/itenary/response/ai-itinerary-result.dto';

@injectable()
export class ItineraryRepository
  extends BaseRepository<
    ItineraryDay,
    Prisma.ItineraryDayWhereInput,
    Prisma.ItineraryDayUpdateInput
  >
  implements IItineraryRepository
{
  constructor(
    @inject(TOKENS.PrismaClient) private readonly _prisma: PrismaClient,
  ) {
    super(_prisma, _prisma.itineraryDay);
  }
  async dayExists(groupId: string, date: Date): Promise<boolean> {
    const day = await this.prisma.itineraryDay.findFirst({
      where: {
        groupId,
        date,
      },

      select: {
        id: true,
      },
    });
    return !!day;
  }
  async getGroupItinerary(
    groupId: string,
  ): Promise<GroupItineraryRepositoryResponse | null> {
    const group = await this.prisma.tripGroup.findUnique({
      where: {
        id: groupId,
      },

      select: {
        id: true,

        itineraryDays: {
          orderBy: {
            date: 'asc',
          },

          select: {
            id: true,
            date: true,
            location: true,
            latitude: true,
            longitude: true,
            summary: true,

            activities: {
              orderBy: {
                startTime: 'asc',
              },

              select: {
                id: true,
                title: true,
                description: true,

                location: true,
                latitude: true,
                longitude: true,

                startTime: true,
                durationMinutes: true,

                notes: true,

                sortOrder: true,
                isCompleted: true,

                category: {
                  select: {
                    code: true,
                    name: true,
                  },
                },

                creator: {
                  select: {
                    id: true,

                    user: {
                      select: {
                        fullName: true,
                        avatarUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      return null;
    }

    return {
      ...group,

      itineraryDays: group.itineraryDays.map((day) => ({
        ...day,

        latitude: day.latitude?.toNumber() ?? null,
        longitude: day.longitude?.toNumber() ?? null,

        activities: day.activities.map((activity) => ({
          ...activity,

          latitude: activity.latitude?.toNumber() ?? null,
          longitude: activity.longitude?.toNumber() ?? null,
        })),
      })),
    };
  }

  async createItineraryDay(data: CreateItineraryDayRequestDTO): Promise<void> {
    const member = await this.prisma.tripGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: data.groupId,
          userId: data.userId,
        },
      },

      select: {
        id: true,
      },
    });

    if (!member) {
      throw new Error('Trip member not found');
    }

    await this.prisma.itineraryDay.create({
      data: {
        groupId: data.groupId,
        date: data.date,
        createdBy: member.id,
        location: data.location!,
        latitude: data.latitude,
        longitude: data.longitude,
        summary: data.summary,
      },
    });
  }

  async createItineraryActivity(
    dto: CreateItineraryActivityRequestDTO,
  ): Promise<{ id: string }> {
    const member = await this.prisma.tripGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: dto.groupId,
          userId: dto.userId,
        },
      },

      select: {
        id: true,
      },
    });

    if (!member) {
      throw new Error('Trip member not found');
    }

    const activity = await this.prisma.itineraryActivity.create({
      data: {
        dayId: dto.dayId,
        title: dto.title,
        description: dto.description,
        location: dto.location!,
        latitude: dto.latitude,
        longitude: dto.longitude,
        categoryCode: dto.categoryCode,
        startTime: dto.startTime!,
        durationMinutes: dto.durationMinutes!,
        notes: dto.notes,
        createdBy: member.id,
      },
      select: {
        id: true,
      },
    });

    return activity;
  }
  async updateActivity(dto: UpdateItineraryActivityRequestDTO): Promise<void> {
    await this.prisma.itineraryActivity.update({
      where: {
        id: dto.activityId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        categoryCode: dto.categoryCode,
        startTime: dto.startTime,
        durationMinutes: dto.durationMinutes,
        notes: dto.notes,
      },
    });
  }

  async toggleActivityCompletion(activityId: string): Promise<void> {
    await this.prisma.itineraryActivity.update({
      where: {
        id: activityId,
      },

      data: {
        isCompleted: true,
      },
    });
  }

  async deleteActivity(activityId: string): Promise<void> {
    await this.prisma.itineraryActivity.delete({
      where: {
        id: activityId,
      },
    });
  }

  async getItineraryDayById(dayId: string): Promise<{
    id: string;
    groupId: string;
  } | null> {
    return this.prisma.itineraryDay.findUnique({
      where: {
        id: dayId,
      },

      select: {
        id: true,
        groupId: true,
      },
    });
  }

  async updateItineraryDay(dto: UpdateItineraryDayRequestDTO): Promise<void> {
    await this.prisma.itineraryDay.update({
      where: {
        id: dto.dayId,
      },

      data: {
        date: dto.date,
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        summary: dto.summary,
      },
    });
  }

  async deleteItineraryDay(dayId: string): Promise<void> {
    await this.prisma.itineraryDay.delete({
      where: {
        id: dayId,
      },
    });
  }

  async getTripForItinerarySetup(groupId: string) {
    return this.prisma.tripGroup
      .findUnique({
        where: {
          id: groupId,
        },

        select: {
          id: true,

          trip: {
            select: {
              id: true,
              dateFrom: true,
              dateTo: true,
            },
          },
        },
      })
      .then((result) => {
        if (!result) return null;

        return {
          groupId: result.id,
          tripId: result.trip.id,
          dateFrom: result.trip.dateFrom,
          dateTo: result.trip.dateTo,
        };
      });
  }

  async createItineraryDays(
    data: {
      groupId: string;
      createdBy: string;
      date: Date;
    }[],
  ): Promise<void> {
    await this.prisma.itineraryDay.createMany({
      data,
    });
  }

  async saveItinerary(
    groupId: string,
    userId: string,
    itinerary: GeneratedItinerary,
  ): Promise<void> {
    const member = await this.prisma.tripGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: groupId,
          userId: userId,
        },
      },

      select: {
        id: true,
      },
    });

    if (!member) {
      throw new Error('Trip member not found');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.itineraryActivity.deleteMany({
        where: {
          day: {
            groupId,
          },
        },
      });

      await tx.itineraryDay.deleteMany({
        where: {
          groupId,
        },
      });

      for (const day of itinerary.days) {
        const createdDay = await tx.itineraryDay.create({
          data: {
            groupId,
            date: new Date(day.date),
            location: day.location,
            latitude: day.latitude ?? null,
            longitude: day.longitude ?? null,
            summary: day.summary,
            createdBy: member.id,
          },
        });

        await tx.itineraryActivity.createMany({
          data: day.activities.map((activity, index) => ({
            dayId: createdDay.id,
            title: activity.title,
            description: activity.description,
            location: activity.location ?? '',
            latitude: activity.latitude ?? null,
            longitude: activity.longitude ?? null,
            categoryCode: activity.category,
            startTime: activity.startTime!,
            durationMinutes: activity.durationMinutes!,
            notes: activity.notes,
            sortOrder: index,
            createdBy: member.id,
          })),
        });
      }
    });
  }
}
