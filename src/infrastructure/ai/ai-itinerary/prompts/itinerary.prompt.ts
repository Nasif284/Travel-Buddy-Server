import { TripPlanningContext } from '../../../../application/dtos/itenary/request/ai-itinery-trip-context.dto';
import { AIPlacesContext } from '../nodes/place-context.node';

import { ITINERARY_SYSTEM_PROMPT } from './itinerary-system-prompts';
import { buildItineraryUserPrompt } from './itinerary-user-prompt';

export function buildItineraryPrompt(
  context: TripPlanningContext,
  placesContext: AIPlacesContext,
) {
  return {
    system: ITINERARY_SYSTEM_PROMPT,
    user: buildItineraryUserPrompt(context, placesContext),
  };
}
