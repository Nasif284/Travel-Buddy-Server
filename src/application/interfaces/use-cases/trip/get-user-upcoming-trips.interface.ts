import { GetUserTripsResponseDTO } from '../../../dtos/trip/responce/get-user-trips.dto';

export interface IGetUserUpcomingTrips {
  execute(dto: { userId: string }): Promise<GetUserTripsResponseDTO>;
}
