import { TripMatchResponseDTO } from '../../../dtos/trip/responce/get-matches.dto';

export interface IGetTripMatches {
  execute(dto: {
    tripId: string;
    page: number;
    limit: number;
  }): Promise<TripMatchResponseDTO>;
}
