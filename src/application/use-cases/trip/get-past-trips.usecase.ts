import { inject, injectable } from 'tsyringe';
import { IGetPastTrips } from '../../interfaces/use-cases/trip/get-past-trips.usecase';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { GetUserTripsResponseDTO } from '../../dtos/trip/responce/get-user-trips.dto';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
@injectable()
export class GetPastTrips implements IGetPastTrips {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { userId: string }): Promise<GetUserTripsResponseDTO> {
    return await this._tripRepository.getUserPastTrips({ userId: dto.userId });
  }
}
