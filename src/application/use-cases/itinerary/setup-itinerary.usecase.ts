import { inject, injectable } from 'tsyringe';
import { ISetupItineraryUseCase } from '../../interfaces/use-cases/itenary/setup-itinerary.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { SetupItineraryRequestDTO } from '../../dtos/itenary/request/setup-itinerary.dto';

@injectable()
export class SetupItineraryUseCase implements ISetupItineraryUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _repository: IItineraryRepository,
  ) {}

  async execute(dto: SetupItineraryRequestDTO): Promise<void> {
    const trip = await this._repository.getTripForItinerarySetup(dto.groupId);
    if (!trip) {
      throw new Error('Trip group not found.');
    }
    const days: {
      groupId: string;
      createdBy: string;
      date: Date;
    }[] = [];

    const current = new Date(trip.dateFrom);
    while (current <= trip.dateTo) {
      days.push({
        groupId: dto.groupId,
        createdBy: dto.userId,
        date: new Date(current),
      });

      current.setDate(current.getDate() + 1);
    }
    await this._repository.createItineraryDays(days);
  }
}
