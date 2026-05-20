import { RefreshTokenRequestDTO } from '../../../../dtos/auth/user/request/refrsh-token.dto';
import { RefreshTokenResponseDTO } from '../../../../dtos/auth/user/responce/refresh-token.dto';
export interface IAdminRefreshToken {
  execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO>;
}
