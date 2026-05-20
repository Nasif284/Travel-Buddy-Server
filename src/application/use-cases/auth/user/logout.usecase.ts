import { inject, injectable } from 'tsyringe';
import { LogoutRequestDTO } from '../../../dtos/auth/user/request/logout.dto';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { ILogout } from '../../../interfaces/use-cases/auth/user/logout.interface';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class Logout implements ILogout {
  constructor(
    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,
    @inject(TOKENS.ISessionService)
    private readonly _sessionService: ISessionService,
  ) {}
  async execute(dto: LogoutRequestDTO): Promise<void> {
    const { refreshToken, userId } = dto;
    const tokenHash = this._tokenService.hashToken(refreshToken);
    await this._sessionService.revoke(userId, tokenHash);
  }
}
