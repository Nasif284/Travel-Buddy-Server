import { GeneratedItinerary } from '../response/ai-itinerary-result.dto';

export interface SaveItineraryRequestDTO {
  groupId: string;
  userId: string;
  itinerary: GeneratedItinerary;
}
