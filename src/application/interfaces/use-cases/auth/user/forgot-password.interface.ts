import { ForgotPasswordRequestDTO } from '../../../../dtos/auth/user/request/fortgot-password.dto';

export interface IForgotPassword {
  execute(dto: ForgotPasswordRequestDTO): Promise<void>;
}
