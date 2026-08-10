import { TripPlanningContext } from '../../dtos/itenary/request/ai-itinery-trip-context.dto';
import { GeneratedItinerary } from '../../dtos/itenary/response/ai-itinerary-result.dto';

export interface IAiItineraryService {
  generate(context: TripPlanningContext): Promise<GeneratedItinerary>;
}
