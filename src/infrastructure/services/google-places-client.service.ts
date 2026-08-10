import axios, { AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';

@injectable()
export class GooglePlacesClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://places.googleapis.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GEOCODING_API_KEY!,
      },
    });
  }

  async searchNearby(body: object, fieldMask: string) {
    const response = await this.http.post('/places:searchNearby', body, {
      headers: {
        'X-Goog-FieldMask': fieldMask,
      },
    });
    return response.data;
  }
}
