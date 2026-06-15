export interface ReverseGeocodeResult {
  city: string | null;
  country: string | null;
  countryCode: string | null;
  stateCode: string | null;
  state: string | null;
  district: string | null;
}
export interface IGeocodingService {
  reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult>;
}
