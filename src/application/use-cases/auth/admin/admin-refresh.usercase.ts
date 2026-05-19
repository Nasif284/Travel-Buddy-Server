import { AccountStatus } from '../../../../domain/enums';
import {
  AccountBannedError,
  AccountSuspendedError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from '../../../../domain/errors/auth.error';
import { RefreshTokenRequestDTO } from '../../../dtos/auth/user/request/refrsh-token.dto';
import { RefreshTokenResponseDTO } from '../../../dtos/auth/user/responce/refresh-token.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IAdminRepository } from '../../../interfaces/repositories/admin.respository';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import ms, { StringValue } from 'ms';
import { config } from '../../../../config/env.config';

export class AdminRefreshToken implements IBaseUseCase<
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO
> {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _tokenService: ITokenService,
    private readonly _sessionService: ISessionService,
    private readonly _adminRepository: IAdminRepository,
  ) {
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }
  async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const { token, userId } = dto;
    const tokenHash = this._tokenService.hashToken(token);
    const isValid = this._sessionService.isValid(userId, tokenHash);
    if (!isValid) throw new InvalidRefreshTokenError();

    const user = await this._adminRepository.findById(userId);
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
    await this._sessionService.store(userId, tokenHash, this._refreshTtl);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      response: {
        success: true,
        message: 'token refreshed successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
          },
        },
      },
    };
  }
}
