import { GetGroupsResponseDTO } from '../../../dtos/trip/responce/get-groups.dto';

export interface IGetActiveGroups {
  execute(dto: { userId: string }): Promise<GetGroupsResponseDTO>;
}
