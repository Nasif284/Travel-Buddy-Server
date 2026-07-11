import { GetMembersResponseDTO } from '../../../dtos/trip/responce/get-members.dto';

export interface IGetMembers {
  execute(dto: { groupId: string }): Promise<GetMembersResponseDTO>;
}
