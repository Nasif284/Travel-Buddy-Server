import { GroupData } from '../../../dtos/trip/responce/get-groups.dto';

export interface IGetGroup {
  execute(dto: { groupId: string }): Promise<GroupData>;
}
