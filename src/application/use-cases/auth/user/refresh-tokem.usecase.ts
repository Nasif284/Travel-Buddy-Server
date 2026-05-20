import { AccountStatus } from '../../../../domain/enums';
import {
  AccountBannedError,
  AccountSuspendedError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from '../../../../domain/errors/auth.error';
import { RefreshTokenRequestDTO } from '../../../dtos/auth/user/request/refrsh-token.dto';
import { RefreshTokenResponseDTO } from '../../../dtos/auth/user/responce/refresh-token.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import ms, { StringValue } from 'ms';
import { config } from '../../../../config/env.config';
import { IRefreshToken } from '../../../interfaces/use-cases/auth/user/refresh-token.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class RefreshToken implements IRefreshToken {
  private readonly _refreshTtl: number;
  constructor(
    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,
    @inject(TOKENS.ISessionService)
    private readonly _sessionService: ISessionService,
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }
  async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const { token, userId } = dto;
    const tokenHash = this._tokenService.hashToken(token);
    const isValid = await this._sessionService.isValid(userId, tokenHash);
    if (!isValid) throw new InvalidRefreshTokenError();

    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    if (user.accountStatusCode == AccountStatus.BANNED) {
      throw new AccountBannedError();
    }
    if (user.accountStatusCode == AccountStatus.SUSPENDED) {
      throw new AccountSuspendedError();
    }

    await this._sessionService.revoke(userId, tokenHash);

    const newAccessToken = this._tokenService.generateAccessToken({
      userId,
      email: user.email,
    });
    const newRefreshToken = this._tokenService.generateRefreshToken({
      userId,
      email: user.email,
    });
    const newRefreshTokenHash = this._tokenService.hashToken(newRefreshToken);
    await this._sessionService.store(
      userId,
      newRefreshTokenHash,
      this._refreshTtl,
    );
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
