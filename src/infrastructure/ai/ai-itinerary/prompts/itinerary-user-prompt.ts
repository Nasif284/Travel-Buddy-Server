import { TripPlanningContext } from '../../../../application/dtos/itenary/request/ai-itinery-trip-context.dto';
import { AIPlacesContext } from '../nodes/place-context.node';
import { buildPlacesSection } from './build-places-prompt-section';

export function buildItineraryUserPrompt(
  context: TripPlanningContext,
  places: AIPlacesContext,
): string {
  return `
Plan a complete trip using the following information.

Destination
Name: ${context.destination.name}
City: ${context.destination.city ?? 'Unknown'}
State: ${context.destination.state ?? 'Unknown'}
Country: ${context.destination.country}
Coordinates
Latitude: ${context.destination.latitude}
Longitude: ${context.destination.longitude}

Trip
Start Date: ${context.trip.startDate}
End Date: ${context.trip.endDate}
Travellers: ${context.trip.travellers}

Budget Style
${context.preferences.budgetStyle}

Travel Style
${context.preferences.travelStyle}

Travel Pace
${context.preferences.tripPace}

Interests
${context.preferences.interests.join(', ')}

Additional Notes
${context.notes ?? 'None'}
${buildPlacesSection(places)}
`;
}
