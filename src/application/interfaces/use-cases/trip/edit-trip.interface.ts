import { EditTripRequestDTO } from '../../../dtos/trip/request/edit-trip.dto';

export interface IEditTrip {
  execute(dto: EditTripRequestDTO): Promise<void>;
}
