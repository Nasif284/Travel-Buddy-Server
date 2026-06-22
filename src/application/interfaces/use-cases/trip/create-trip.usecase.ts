import { CreateTripRequestDTO } from '../../../dtos/trip/request/create-trip.dto';

export interface ICreateTrip {
  execute(dto: CreateTripRequestDTO): Promise<void>;
}
