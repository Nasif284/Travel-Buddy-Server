import { AuthResponseDTO } from '../../../../dtos/auth/user/responce/login.dto';

export interface IAuthMe {
  execute(dto: { userId: string }): Promise<AuthResponseDTO>;
}
