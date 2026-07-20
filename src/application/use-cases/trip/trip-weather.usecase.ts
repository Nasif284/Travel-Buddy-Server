import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IWeatherService } from '../../interfaces/services/weather.service.interface';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GetTripWeatherRequestDTO } from '../../dtos/trip/request/get-weather.dto';
import { TripWeatherResponseDTO } from '../../dtos/trip/responce/get-weather.dto';
import { IGetWeather } from '../../interfaces/use-cases/trip/get-weather.interface';

@injectable()
export class GetTripWeather implements IGetWeather {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly tripGroupRepository: ITripRepository,

    @inject(TOKENS.IWeatherService)
    private readonly weatherService: IWeatherService,
  ) {}

  async execute(
    request: GetTripWeatherRequestDTO,
  ): Promise<TripWeatherResponseDTO> {
    const { tripGroupId } = request;

    const destination =
      await this.tripGroupRepository.getTripDestination(tripGroupId);
    return this.weatherService.getCurrentWeather(destination!);
  }
}
