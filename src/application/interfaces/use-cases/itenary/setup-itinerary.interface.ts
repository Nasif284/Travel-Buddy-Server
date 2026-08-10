import { SetupItineraryRequestDTO } from '../../../dtos/itenary/request/setup-itinerary.dto';

export interface ISetupItineraryUseCase {
  execute(dto: SetupItineraryRequestDTO): Promise<void>;
}
