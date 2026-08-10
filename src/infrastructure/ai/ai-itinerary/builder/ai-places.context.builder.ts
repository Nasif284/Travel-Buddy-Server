import { NearbyPlaceDTO } from '../../../../application/interfaces/services/places.service.interface';
import { AIPlacesContext } from '../nodes/place-context.node';
export interface PlacesSearchResult {
  attractions: NearbyPlaceDTO[];
  restaurants: NearbyPlaceDTO[];
  cafes: NearbyPlaceDTO[];
  parks: NearbyPlaceDTO[];
  hotels?: NearbyPlaceDTO[];
  viewpoints?: NearbyPlaceDTO[];
  shopping?: NearbyPlaceDTO[];
}
export class PlaceContextBuilder {
  static build(places: PlacesSearchResult): AIPlacesContext {
    return {
      attractions: this.optimizePlaces(places.attractions, 12),
      restaurants: this.optimizePlaces(places.restaurants, 8),
      cafes: this.optimizePlaces(places.cafes, 6),
      parks: this.optimizePlaces(places.parks, 6),
      hotels: this.optimizePlaces(places.hotels ?? [], 5),
      viewpoints: this.optimizePlaces(places.viewpoints ?? [], 6),
      shopping: this.optimizePlaces(places.shopping ?? [], 5),
    };
  }

  private static optimizePlaces(
    places: NearbyPlaceDTO[],
    limit: number,
  ): NearbyPlaceDTO[] {
    return places
      .sort((a, b) => {
        const scoreA = (a.rating ?? 0) * Math.log10((a.reviewCount ?? 0) + 1);
        const scoreB = (b.rating ?? 0) * Math.log10((b.reviewCount ?? 0) + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}
