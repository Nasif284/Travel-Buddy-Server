import { LoginResponseDTO } from '../../../../dtos/auth/user/responce/login.dto';

export interface IGoogleAuth {
  execute(dto: { token: string }): Promise<LoginResponseDTO>;
}
