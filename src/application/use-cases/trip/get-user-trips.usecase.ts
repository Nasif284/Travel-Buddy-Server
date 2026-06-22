import { inject, injectable } from 'tsyringe';
import { GetUserTripsResponseDTO } from '../../dtos/trip/responce/get-user-trips.dto';
import { IGetUserUpcomingTrips } from '../../interfaces/use-cases/trip/get-user-upcoming-trips.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
@injectable()
export class GetUserUpcomingTrips implements IGetUserUpcomingTrips {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { userId: string }): Promise<GetUserTripsResponseDTO> {
    return await this._tripRepository.getUserUpcomingTrips({
      userId: dto.userId,
    });
  }
}
