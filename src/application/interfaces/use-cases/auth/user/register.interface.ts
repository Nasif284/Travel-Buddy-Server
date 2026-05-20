import { RegisterRequestDTO } from '../../../../dtos/auth/user/request/register.dto';
import { RegisterResponseDTO } from '../../../../dtos/auth/user/responce/register.dto';

export interface IRegister {
  execute(dto: RegisterRequestDTO): Promise<RegisterResponseDTO>;
}
