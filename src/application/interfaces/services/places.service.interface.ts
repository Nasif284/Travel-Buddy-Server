export enum PlaceCategory {
  ATTRACTION = 'ATTRACTION',
  FOOD = 'FOOD',
  CAFE = 'CAFE',
  HOTEL = 'HOTEL',
  PARK = 'PARK',
  VIEWPOINT = 'VIEWPOINT',
  TEMPLE = 'TEMPLE',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',
}
export interface NearbyPlaceDTO {
  placeId: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  address?: string;
  googleTypes: string[];
}
export interface NearbySearchRequest {
  latitude: number;
  longitude: number;
  radius?: number;
  includedTypes: string[];
  maxResults?: number;
}

export interface IPlacesService {
  searchNearby(request: NearbySearchRequest): Promise<NearbyPlaceDTO[]>;
  getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius?: number,
  ): Promise<NearbyPlaceDTO[]>;
}

const TYPE_MAPPING: Record<string, PlaceCategory> = {
  restaurant: PlaceCategory.FOOD,
  indian_restaurant: PlaceCategory.FOOD,
  chinese_restaurant: PlaceCategory.FOOD,
  south_indian_restaurant: PlaceCategory.FOOD,
  fast_food_restaurant: PlaceCategory.FOOD,
  pizza_restaurant: PlaceCategory.FOOD,
  seafood_restaurant: PlaceCategory.FOOD,
  food: PlaceCategory.FOOD,

  cafe: PlaceCategory.CAFE,
  coffee_shop: PlaceCategory.CAFE,

  lodging: PlaceCategory.HOTEL,
  hotel: PlaceCategory.HOTEL,
  resort_hotel: PlaceCategory.HOTEL,

  tourist_attraction: PlaceCategory.ATTRACTION,
  museum: PlaceCategory.ATTRACTION,
  art_gallery: PlaceCategory.ATTRACTION,
  aquarium: PlaceCategory.ATTRACTION,
  zoo: PlaceCategory.ATTRACTION,
  amusement_park: PlaceCategory.ATTRACTION,
  visitor_center: PlaceCategory.ATTRACTION,
  historical_landmark: PlaceCategory.ATTRACTION,

  scenic_point: PlaceCategory.VIEWPOINT,
  observation_deck: PlaceCategory.VIEWPOINT,
  natural_feature: PlaceCategory.VIEWPOINT,
  mountain_peak: PlaceCategory.VIEWPOINT,

  park: PlaceCategory.PARK,
  national_park: PlaceCategory.PARK,
  botanical_garden: PlaceCategory.PARK,

  shopping_mall: PlaceCategory.SHOPPING,
  market: PlaceCategory.SHOPPING,

  hindu_temple: PlaceCategory.TEMPLE,
  mosque: PlaceCategory.TEMPLE,
  church: PlaceCategory.TEMPLE,
  synagogue: PlaceCategory.TEMPLE,
};
export function mapGooglePlaceTypes(types: string[]): PlaceCategory {
  for (const type of types) {
    const category = TYPE_MAPPING[type];
    if (category) {
      return category;
    }
  }
  return PlaceCategory.OTHER;
}
