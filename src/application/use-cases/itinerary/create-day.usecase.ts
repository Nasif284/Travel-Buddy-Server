import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { ICreateItineraryDayUseCase } from '../../interfaces/use-cases/itenary/create-day.interface';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { CreateItineraryDayRequestDTO } from '../../dtos/itenary/request/create-day';

@injectable()
export class CreateItineraryDayUseCase implements ICreateItineraryDayUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,
  ) {}

  async execute(dto: CreateItineraryDayRequestDTO): Promise<void> {
    await this._itineraryRepository.createItineraryDay(dto);
  }
}
