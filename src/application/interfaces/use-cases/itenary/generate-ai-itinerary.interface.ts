import { GenerateAiItineraryRequestDTO } from '../../../dtos/itenary/request/generate-ai-itinerary.dto';
import { GeneratedItinerary } from '../../../dtos/itenary/response/ai-itinerary-result.dto';

export interface IGenerateAiItineraryUseCase {
  execute(request: GenerateAiItineraryRequestDTO): Promise<GeneratedItinerary>;
}
