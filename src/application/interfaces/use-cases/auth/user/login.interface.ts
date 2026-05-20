import { LoginRequestDTO } from '../../../../dtos/auth/user/request/login.dto';
import { LoginResponseDTO } from '../../../../dtos/auth/user/responce/login.dto';

export interface ILogin {
  execute(dto: LoginRequestDTO): Promise<LoginResponseDTO>;
}
