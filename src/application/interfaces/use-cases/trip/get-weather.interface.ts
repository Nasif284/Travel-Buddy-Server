import { GetTripWeatherRequestDTO } from '../../../dtos/trip/request/get-weather.dto';
import { TripWeatherResponseDTO } from '../../../dtos/trip/responce/get-weather.dto';

export interface IGetWeather {
  execute(dto: GetTripWeatherRequestDTO): Promise<TripWeatherResponseDTO>;
}
