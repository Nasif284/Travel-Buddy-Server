import { inject, injectable } from 'tsyringe';
import { IUpdateItineraryDayUseCase } from '../../interfaces/use-cases/itenary/update-dat.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { UpdateItineraryDayRequestDTO } from '../../dtos/itenary/request/update-day.dto';

@injectable()
export class UpdateItineraryDayUseCase implements IUpdateItineraryDayUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _repository: IItineraryRepository,
  ) {}

  async execute(dto: UpdateItineraryDayRequestDTO): Promise<void> {
    await this._repository.updateItineraryDay({
      dayId: dto.dayId,
      date: dto.date,
      location: dto.location,
      latitude: dto.latitude,
      longitude: dto.longitude,
      summary: dto.summary,
    });
  }
}
