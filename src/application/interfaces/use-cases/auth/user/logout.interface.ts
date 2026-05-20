import { LogoutRequestDTO } from '../../../../dtos/auth/user/request/logout.dto';

export interface ILogout {
  execute(dto: LogoutRequestDTO): Promise<void>;
}
