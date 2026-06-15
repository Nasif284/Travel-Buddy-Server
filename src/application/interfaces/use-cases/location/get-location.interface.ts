import { GetLocationRequestDTO } from '../../../dtos/location/request/get-location.dto';
import { GetLocationResponseDTO } from '../../../dtos/location/response/get-locatiuon.dto';

export interface IGetLocation {
  execute(dto: GetLocationRequestDTO): Promise<GetLocationResponseDTO>;
}
