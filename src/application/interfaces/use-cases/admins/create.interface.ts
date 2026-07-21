import { CreateAdminRequestDTO } from '../../../dtos/admins/request/create-admin.dto';
import { CreateAdminResponseDTO } from '../../../dtos/admins/response/create-admin.dto';

export interface ICreate {
  execute(dto: CreateAdminRequestDTO): Promise<CreateAdminResponseDTO>;
}
