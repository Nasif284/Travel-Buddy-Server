import { GetGroupInvitesResponse } from '../../../dtos/trip/responce/get-invites.dto';

export interface IGetInvites {
  execute(dto: { groupId: string }): Promise<GetGroupInvitesResponse>;
}
