import { UpdateAdminRequestDTO } from '../../../dtos/admins/request/update-admin.dto';

export interface IUpdateAdmin {
  execute(dto: UpdateAdminRequestDTO): Promise<void>;
}
