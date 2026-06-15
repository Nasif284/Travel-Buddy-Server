import { GetNearbyUsersRequestDTO } from '../../../dtos/users/request/nearby-users.dto';
import { NearbyUsersResponseDTO } from '../../../dtos/users/response/nearby-users.dto';

export interface IGetNearbyUsers {
  execute(dto: GetNearbyUsersRequestDTO): Promise<NearbyUsersResponseDTO>;
}
