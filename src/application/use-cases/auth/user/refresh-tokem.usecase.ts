import { StringValue } from 'ms';
import { AccountStatus } from '../../../../domain/enums';
import {
  AccountBannedError,
  AccountSuspendedError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from '../../../../domain/errors/auth.error';
import {
  JwtTokenService,
  RedisSessionService,
} from '../../../../infrastructure/services';
import { RefreshTokenRequestDTO } from '../../../dtos/auth/request/refrsh-token.dto';
import { RefreshTokenResponseDTO } from '../../../dtos/auth/responce/refresh-token.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { config } from '../../../../config/env.config';

export class RefreshToken implements IBaseUseCase<
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO
> {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _tokenService: JwtTokenService,
    private readonly _sessionService: RedisSessionService,
    private readonly _userRepository: IUserRepository,
  ) {
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }
  async execute(dto: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const { token, userId } = dto;
    const tokenHash = this._tokenService.hashToken(token);
    const isValid = this._sessionService.isValid(userId, tokenHash);
    if (!isValid) throw new InvalidRefreshTokenError();

    const user = await this._userRepository.findById(userId);
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
