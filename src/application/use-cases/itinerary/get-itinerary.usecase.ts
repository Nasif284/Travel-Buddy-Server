import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import {
  GetGroupItineraryResponseDTO,
  ItineraryActivityDTO,
  ItineraryActivityRepositoryResponse,
  ItineraryDayDTO,
  ItineraryDayRepositoryResponse,
} from '../../dtos/itenary/response/get-itenary.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { IGetGroupItineraryUseCase } from '../../interfaces/use-cases/itenary/get-itenary.interface';

@injectable()
export class GetGroupItineraryUseCase implements IGetGroupItineraryUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,

    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(dto: {
    groupId: string;
  }): Promise<GetGroupItineraryResponseDTO> {
    const itinerary = await this._itineraryRepository.getGroupItinerary(
      dto.groupId,
    );

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    return {
      groupId: itinerary.id,
      days: await Promise.all(
        itinerary.itineraryDays.map((day) => this.mapDay(day)),
      ),
    };
  }

  private async mapDay(
    day: ItineraryDayRepositoryResponse,
  ): Promise<ItineraryDayDTO> {
    return {
      id: day.id,
      date: day.date,
      location: day.location,
      latitude: day.latitude,
      longitude: day.longitude,
      summary: day.summary,

      activities: await Promise.all(
        day.activities.map((activity) => this.mapActivity(activity)),
      ),
    };
  }

  private async mapActivity(
    activity: ItineraryActivityRepositoryResponse,
  ): Promise<ItineraryActivityDTO> {
    return {
      id: activity.id,

      title: activity.title,
      description: activity.description,

      location: activity.location,
      latitude: activity.latitude,
      longitude: activity.longitude,

      category: activity.category,

      startTime: activity.startTime,
      durationMinutes: activity.durationMinutes,

      notes: activity.notes,

      isCompleted: activity.isCompleted,

      createdBy: {
        id: activity.creator.id,
        fullName: activity.creator.user.fullName,
        avatarUrl: activity.creator.user.avatarUrl
          ? await this._storageService.getSignedUrl(
              activity.creator.user.avatarUrl,
            )
          : null,
      },
    };
  }
}
