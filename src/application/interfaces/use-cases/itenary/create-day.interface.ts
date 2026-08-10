import { CreateItineraryDayRequestDTO } from '../../../dtos/itenary/request/create-day';

export interface ICreateItineraryDayUseCase {
  execute(dto: CreateItineraryDayRequestDTO): Promise<void>;
}
