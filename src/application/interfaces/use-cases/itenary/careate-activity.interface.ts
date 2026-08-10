import { CreateItineraryActivityRequestDTO } from '../../../dtos/itenary/request/create-activity.dto';

export interface ICreateItineraryActivityUseCase {
  execute(dto: CreateItineraryActivityRequestDTO): Promise<void>;
}
