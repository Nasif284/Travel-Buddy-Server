import {
  TripDestination,
  TripWeatherResponseDTO,
} from '../../dtos/trip/responce/get-weather.dto';

export interface IWeatherService {
  getCurrentWeather(
    destination: TripDestination,
  ): Promise<TripWeatherResponseDTO>;
}
