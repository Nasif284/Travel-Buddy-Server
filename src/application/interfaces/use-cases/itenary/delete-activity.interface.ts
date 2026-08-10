import { DeleteItineraryActivityRequestDTO } from '../../../dtos/itenary/request/delete-activity.dto';

export interface IDeleteItineraryActivityUseCase {
  execute(dto: DeleteItineraryActivityRequestDTO): Promise<void>;
}
