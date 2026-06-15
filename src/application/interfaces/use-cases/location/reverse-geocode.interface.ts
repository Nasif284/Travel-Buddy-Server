import { ReverseGeoCodeRequestDTO } from '../../../dtos/location/request/reverse-geocode.dto';
import { ReverseGeoCodeResponseDTO } from '../../../dtos/location/response/reverse-geocode.dto';

export interface IReverseGeoCode {
  execute(dto: ReverseGeoCodeRequestDTO): Promise<ReverseGeoCodeResponseDTO>;
}
