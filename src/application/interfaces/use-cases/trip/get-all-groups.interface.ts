import { GetGroupsResponseDTO } from '../../../dtos/trip/responce/get-groups.dto';

export interface IGetAllTripGroups {
  execute(): Promise<GetGroupsResponseDTO>;
}
