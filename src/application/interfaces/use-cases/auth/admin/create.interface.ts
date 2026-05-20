import { CreateAdminRequestDTO } from '../../../../dtos/auth/admin/request/create-admin.dto';
import { CreateAdminResponseDTO } from '../../../../dtos/auth/admin/response/create-admin.dto';

export interface ICreate {
  execute(dto: CreateAdminRequestDTO): Promise<CreateAdminResponseDTO>;
}
