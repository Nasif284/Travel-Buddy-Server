import {
  IPlacesService,
  NearbyPlaceDTO,
} from '../../../../application/interfaces/services/places.service.interface';
import { PlaceContextBuilder } from '../builder/ai-places.context.builder';
import { ItineraryGraphState } from '../itinerary.states';

export interface AIPlacesContext {
  attractions: NearbyPlaceDTO[];
  restaurants: NearbyPlaceDTO[];
  cafes: NearbyPlaceDTO[];
  parks: NearbyPlaceDTO[];
  hotels: NearbyPlaceDTO[];
  viewpoints: NearbyPlaceDTO[];
  shopping: NearbyPlaceDTO[];
}
export async function buildPlacesContextNode(
  state: ItineraryGraphState,
  placesService: IPlacesService,
) {
  const destination = state.context.destination;

  const [attractions, restaurants, cafes, parks] = await Promise.all([
    placesService.searchNearby({
      latitude: destination.latitude,
      longitude: destination.longitude,
      includedTypes: ['tourist_attraction', 'museum', 'historical_landmark'],
      maxResults: 15,
    }),

    placesService.searchNearby({
      latitude: destination.latitude,
      longitude: destination.longitude,
      includedTypes: ['restaurant'],
      maxResults: 10,
    }),

    placesService.searchNearby({
      latitude: destination.latitude,
      longitude: destination.longitude,
      includedTypes: ['cafe'],
      maxResults: 8,
    }),

    placesService.searchNearby({
      latitude: destination.latitude,
      longitude: destination.longitude,
      includedTypes: ['park'],
      maxResults: 8,
    }),
  ]);

  return {
    placesContext: PlaceContextBuilder.build({
      attractions,
      restaurants,
      cafes,
      parks,
    }),
  };
}
