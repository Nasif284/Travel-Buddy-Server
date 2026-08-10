import { UpdateItineraryActivityRequestDTO } from '../../../dtos/itenary/request/update-activity.dto';

export interface IUpdateItineraryActivityUseCase {
  execute(dto: UpdateItineraryActivityRequestDTO): Promise<void>;
}
