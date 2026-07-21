import { GetGroupsResponseDTO } from '../../../dtos/trip/responce/get-groups.dto';

export interface IGetUserGroups {
  execute(dto: { userId: string }): Promise<GetGroupsResponseDTO>;
}
