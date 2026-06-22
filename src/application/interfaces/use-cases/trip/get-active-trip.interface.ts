import { GetActiveTripResponseDTO } from '../../../dtos/trip/responce/get-active-trip.dto';

export interface IGetActiveTrip {
  execute(dto: { userId: string }): Promise<GetActiveTripResponseDTO | null>;
}
