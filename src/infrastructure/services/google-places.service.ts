import { inject, injectable } from 'tsyringe';
import {
  IPlacesService,
  mapGooglePlaceTypes,
  NearbyPlaceDTO,
  NearbySearchRequest,
} from '../../application/interfaces/services/places.service.interface';
import { GooglePlacesClient } from './google-places-client.service';
import { TOKENS } from '../di/tokens';
export const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.primaryType',
  'places.types',
  'places.rating',
  'places.userRatingCount',
  'places.formattedAddress',
].join(',');
export interface GoogleNearbyPlace {
  id: string;
  displayName: {
    text: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  primaryType?: string;
  types?: string[];
  rating?: number;
  userRatingCount?: number;
  formattedAddress?: string;
}

export interface GoogleNearbySearchResponse {
  places: GoogleNearbyPlace[];
}
@injectable()
export class GooglePlacesService implements IPlacesService {
  constructor(
    @inject(TOKENS.GooglePlacesClient)
    private readonly _client: GooglePlacesClient,
  ) {}

  async searchNearby(request: NearbySearchRequest): Promise<NearbyPlaceDTO[]> {
    const response = await this._client.searchNearby(
      {
        includedTypes: request.includedTypes,
        maxResultCount: request.maxResults ?? 20,

        locationRestriction: {
          circle: {
            center: {
              latitude: request.latitude,
              longitude: request.longitude,
            },
            radius: request.radius ?? 15000,
          },
        },
      },
      FIELD_MASK,
    );

    return response.places.map(this.mapNearbyPlace);
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius = 15000,
  ): Promise<NearbyPlaceDTO[]> {
    return this.searchNearby({
      latitude,
      longitude,
      radius,
      includedTypes: [
        'tourist_attraction',
        'museum',
        'park',
        'restaurant',
        'cafe',
        'shopping_mall',
        'art_gallery',
        'historical_landmark',
        'hindu_temple',
      ],
      maxResults: 20,
    });
  }

  private mapNearbyPlace(place: GoogleNearbyPlace): NearbyPlaceDTO {
    return {
      placeId: place.id,
      name: place.displayName.text,
      category: mapGooglePlaceTypes(place.types ?? []),
      latitude: place.location.latitude,
      longitude: place.location.longitude,
      rating: place.rating,
      reviewCount: place.userRatingCount,
      address: place.formattedAddress,
      googleTypes: place.types ?? [],
    };
  }
}
