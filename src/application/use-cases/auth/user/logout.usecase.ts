import { LogoutRequestDTO } from '../../../dtos/auth/user/request/logout.dto';
import { LogoutResponseInterface } from '../../../dtos/auth/user/responce/logout.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';

export class Logout implements IBaseUseCase<
  LogoutRequestDTO,
  LogoutResponseInterface
> {
  constructor(
    private readonly _tokenService: ITokenService,
    private readonly _sessionService: ISessionService,
  ) {}
  async execute(dto: LogoutRequestDTO): Promise<LogoutResponseInterface> {
    const { refreshToken, userId } = dto;
    const tokenHash = this._tokenService.hashToken(refreshToken);
    await this._sessionService.revoke(userId, tokenHash);
    return {
      success: true,
      message: 'User logged out successfully',
    };
  }
}
