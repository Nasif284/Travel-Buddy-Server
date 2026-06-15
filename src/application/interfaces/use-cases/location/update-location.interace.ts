import { UpdateLocationRequestDTO } from '../../../dtos/location/request/update-location.dto';
export interface IUpdateUserLocation {
  execute(dto: UpdateLocationRequestDTO): Promise<void>;
}
