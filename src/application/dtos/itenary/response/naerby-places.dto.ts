export interface NearbyPlaceDTO {
  placeId: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  rating?: number;
  address?: string;
}
