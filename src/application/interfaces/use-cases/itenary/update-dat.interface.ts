import { UpdateItineraryDayRequestDTO } from '../../../dtos/itenary/request/update-day.dto';

export interface IUpdateItineraryDayUseCase {
  execute(dto: UpdateItineraryDayRequestDTO): Promise<void>;
}
