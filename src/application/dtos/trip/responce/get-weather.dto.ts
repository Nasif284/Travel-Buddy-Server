export interface TripWeatherResponseDTO {
  location: {
    city: string;
    state?: string | null;
    country: string;
  };

  current: {
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    isDay: boolean;
    updatedAt: Date;
  };

  today: {
    minTemperature: number;
    maxTemperature: number;
  };
}
export interface TripDestination {
  latitude: number;
  longitude: number;
  destinationId: string;
  city: string;
  state?: string | null;
  country: string;
}
