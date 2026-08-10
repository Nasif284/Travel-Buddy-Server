import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IDeleteItineraryDayUseCase } from '../../interfaces/use-cases/itenary/delete-day.interface';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';

@injectable()
export class DeleteItineraryDayUseCase implements IDeleteItineraryDayUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _repository: IItineraryRepository,
  ) {}

  async execute(dto: { dayId: string }): Promise<void> {
    await this._repository.deleteItineraryDay(dto.dayId);
  }
}
