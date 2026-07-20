import axios from 'axios';
import { inject, injectable } from 'tsyringe';
import { Redis } from 'ioredis';
import { IWeatherService } from '../../application/interfaces/services/weather.service.interface';
import { TOKENS } from '../di/tokens';
import {
  TripDestination,
  TripWeatherResponseDTO,
} from '../../application/dtos/trip/responce/get-weather.dto';
export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
    time: string;
  };

  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}
export class WeatherCodeMapper {
  static getDescription(code: number): string {
    switch (code) {
      case 0:
        return 'Clear Sky';

      case 1:
        return 'Mainly Clear';

      case 2:
        return 'Partly Cloudy';

      case 3:
        return 'Overcast';

      case 45:
      case 48:
        return 'Fog';

      case 51:
      case 53:
      case 55:
        return 'Drizzle';

      case 61:
      case 63:
      case 65:
        return 'Rain';

      case 71:
      case 73:
      case 75:
        return 'Snow';

      case 80:
      case 81:
      case 82:
        return 'Rain Showers';

      case 95:
        return 'Thunderstorm';

      default:
        return 'Unknown';
    }
  }
}

@injectable()
export class OpenMeteoWeatherService implements IWeatherService {
  private readonly CACHE_TTL = 60 * 15;
  constructor(
    @inject(TOKENS.RedisClient)
    private readonly redis: Redis,
  ) {}

  async getCurrentWeather(
    destination: TripDestination,
  ): Promise<TripWeatherResponseDTO> {
    const { latitude, longitude, city, state, country, destinationId } =
      destination;
    const key = this.cacheKey(destinationId);

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as TripWeatherResponseDTO;
    }

    const { data } = await axios.get<OpenMeteoResponse>(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude,
          longitude,

          current: [
            'temperature_2m',
            'apparent_temperature',
            'relative_humidity_2m',
            'wind_speed_10m',
            'wind_direction_10m',
            'weather_code',
            'is_day',
          ].join(','),

          daily: ['temperature_2m_max', 'temperature_2m_min'].join(','),

          timezone: 'auto',
          forecast_days: 1,
        },
      },
    );

    const weather: TripWeatherResponseDTO = {
      location: {
        city,
        state,
        country,
      },

      current: {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        weatherCode: data.current.weather_code,
        weatherDescription: WeatherCodeMapper.getDescription(
          data.current.weather_code,
        ),
        isDay: data.current.is_day === 1,
        updatedAt: new Date(data.current.time),
      },

      today: {
        minTemperature: data.daily.temperature_2m_min[0],

        maxTemperature: data.daily.temperature_2m_max[0],
      },
    };

    await this.redis.setex(key, this.CACHE_TTL, JSON.stringify(weather));

    return weather;
  }

  private cacheKey(destinationId: string) {
    return `weather:${destinationId}`;
  }
}
