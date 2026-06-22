import { inject, injectable } from 'tsyringe';
import { IGetActiveTrip } from '../../interfaces/use-cases/trip/get-active-trip.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GetActiveTripResponseDTO } from '../../dtos/trip/responce/get-active-trip.dto';
@injectable()
export class GetActiveTrip implements IGetActiveTrip {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: {
    userId: string;
  }): Promise<GetActiveTripResponseDTO | null> {
    const trip = this._tripRepository.getActiveTrip({ userId: dto.userId });
    if (!trip) {
      return null;
    }
    return trip;
  }
}
