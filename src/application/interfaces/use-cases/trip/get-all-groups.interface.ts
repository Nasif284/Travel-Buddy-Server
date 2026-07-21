import { GetGroupsRequestDTO } from '../../../dtos/trip/request/get-all-groups.dto';
import { GetGroupsResponseDTO } from '../../../dtos/trip/responce/get-groups.dto';

export interface IGetAllTripGroups {
  execute(dto: GetGroupsRequestDTO): Promise<GetGroupsResponseDTO>;
}
