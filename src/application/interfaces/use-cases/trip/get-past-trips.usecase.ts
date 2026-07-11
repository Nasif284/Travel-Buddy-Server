import { GetUserTripsResponseDTO } from '../../../dtos/trip/responce/get-user-trips.dto';

export interface IGetPastTrips {
  execute(dto: { userId: string }): Promise<GetUserTripsResponseDTO>;
}
