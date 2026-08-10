import { SaveItineraryRequestDTO } from '../../dtos/itenary/request/save-tinerary.dto';

export interface ISaveItineraryUseCase {
  execute(request: SaveItineraryRequestDTO): Promise<void>;
}
