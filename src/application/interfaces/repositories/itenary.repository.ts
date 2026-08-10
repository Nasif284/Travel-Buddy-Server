import { CreateItineraryActivityRequestDTO } from '../../dtos/itenary/request/create-activity.dto';
import { CreateItineraryDayRequestDTO } from '../../dtos/itenary/request/create-day';
import { UpdateItineraryActivityRequestDTO } from '../../dtos/itenary/request/update-activity.dto';
import { UpdateItineraryDayRequestDTO } from '../../dtos/itenary/request/update-day.dto';
import { GeneratedItinerary } from '../../dtos/itenary/response/ai-itinerary-result.dto';
import { GroupItineraryRepositoryResponse } from '../../dtos/itenary/response/get-itenary.dto';

export interface IItineraryRepository {
  getGroupItinerary(
    groupId: string,
  ): Promise<GroupItineraryRepositoryResponse | null>;
  createItineraryDay(data: CreateItineraryDayRequestDTO): Promise<void>;
  dayExists(groupId: string, date: Date): Promise<boolean>;
  createItineraryActivity(
    dto: CreateItineraryActivityRequestDTO,
  ): Promise<{ id: string }>;
  updateActivity(dto: UpdateItineraryActivityRequestDTO): Promise<void>;
  toggleActivityCompletion(activityId: string): Promise<void>;
  deleteActivity(activityId: string): Promise<void>;
  getItineraryDayById(dayId: string): Promise<{
    id: string;
    groupId: string;
  } | null>;
  updateItineraryDay(dto: UpdateItineraryDayRequestDTO): Promise<void>;
  deleteItineraryDay(dayId: string): Promise<void>;
  getTripForItinerarySetup(groupId: string): Promise<{
    groupId: string;
    tripId: string;
    dateFrom: Date;
    dateTo: Date;
  } | null>;

  createItineraryDays(
    data: {
      groupId: string;
      createdBy: string;
      date: Date;
    }[],
  ): Promise<void>;
  saveItinerary(
    groupId: string,
    userId: string,
    itinerary: GeneratedItinerary,
  ): Promise<void>;
}
