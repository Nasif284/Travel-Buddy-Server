import axios from 'axios';
import {
  IGeocodingService,
  ReverseGeocodeResult,
} from '../../application/interfaces/services/geocode.service.interfcae';
import { config } from '../../config/env.config';
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export class GoogleGeocodingService implements IGeocodingService {
  async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResult> {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: config.geoCoding.apiKey,
        },
      },
    );

    const components: AddressComponent[] =
      response.data.results?.[0]?.address_components ?? [];
    const city =
      components.find((c: AddressComponent) => c.types.includes('locality'))
        ?.long_name ??
      components.find((c: AddressComponent) =>
        c.types.includes('administrative_area_level_3'),
      )?.long_name ??
      null;

    const country =
      components.find((c: AddressComponent) => c.types.includes('country'))
        ?.long_name ?? null;
    const countryCode =
      components.find((c: AddressComponent) => c.types.includes('country'))
        ?.short_name ?? null;
    const stateCode =
      components.find((c: AddressComponent) =>
        c.types.includes('administrative_area_level_1'),
      )?.short_name ?? null;
    const state =
      components.find((c: AddressComponent) =>
        c.types.includes('administrative_area_level_1'),
      )?.long_name ?? null;
    const district =
      components.find((c: AddressComponent) =>
        c.types.includes('administrative_area_level_2'),
      )?.long_name ??
      components.find((c: AddressComponent) =>
        c.types.includes('administrative_area_level_3'),
      )?.long_name ??
      null;

    return {
      country,
      city,
      countryCode,
      stateCode,
      state,
      district,
    };
  }
}
