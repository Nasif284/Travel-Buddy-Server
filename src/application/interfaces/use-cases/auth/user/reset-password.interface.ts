import { ResetPasswordRequestDTO } from '../../../../dtos/auth/user/request/reset-password.dto';

export interface IResetPassword {
  execute(dto: ResetPasswordRequestDTO): Promise<void>;
}
