import { inject, injectable } from 'tsyringe';
import { IDeleteTrip } from '../../interfaces/use-cases/trip/delete-trip.usecase';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { TripStatus } from '../../../domain/enums/trip.constants';
@injectable()
export class DeleteTrip implements IDeleteTrip {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { tripId: string }): Promise<void> {
    await this._tripRepository.editTrip(dto.tripId, {
      statusCode: TripStatus.CANCELLED,
    });
  }
}
