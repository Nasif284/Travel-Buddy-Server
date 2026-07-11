import { inject, injectable } from 'tsyringe';
import { IEditTrip } from '../../interfaces/use-cases/trip/edit-trip.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { EditTripRequestDTO } from '../../dtos/trip/request/edit-trip.dto';
@injectable()
export class EditTrip implements IEditTrip {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: EditTripRequestDTO): Promise<void> {
    const { budgetStyleCode, dateFrom, dateTo, travelStyleCode, tripId } = dto;
    await this._tripRepository.editTrip(tripId, {
      budgetStyleCode,
      dateFrom,
      dateTo,
      travelStyleCode,
    });
  }
}
