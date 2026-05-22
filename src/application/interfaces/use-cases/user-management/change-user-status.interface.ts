import { ChangeUserStatusRequestDTO } from '../../../dtos/user-management/request/change-status.dto';

export interface IChangeUserStatus {
  execute(dto: ChangeUserStatusRequestDTO): Promise<void>;
}
