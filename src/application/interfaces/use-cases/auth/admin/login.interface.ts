import { AdminLoginResponseDTO } from '../../../../dtos/auth/admin/response/admin-login.dto';
import { LoginRequestDTO } from '../../../../dtos/auth/user/request/login.dto';

export interface IAdminLogin {
  execute(dto: LoginRequestDTO): Promise<AdminLoginResponseDTO>;
}
