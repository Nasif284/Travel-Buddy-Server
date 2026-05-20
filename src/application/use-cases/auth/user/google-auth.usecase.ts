import ms, { StringValue } from 'ms';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { verifyGoogleToken } from '../../../../infrastructure/services/google-auth.service';
import { AppError } from '../../../../presentation/Errors/app.error';
import { LoginResponseDTO } from '../../../dtos/auth/user/responce/login.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { config } from '../../../../config/env.config';
import { IGoogleAuth } from '../../../interfaces/use-cases/auth/user/google-auth.interface';

export class GoogleAuth implements IGoogleAuth {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _sessionService: ISessionService,
  ) {
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }
  async execute(dto: { token: string }): Promise<LoginResponseDTO> {
    const { token } = dto;
    const payload = await verifyGoogleToken(token);

    if (!payload?.email) {
      throw new Error('Invalid Google token');
    }
    if (!payload.name) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'GOOGLE AUTH ERROR',
        'Full name is required',
      );
    }
    const user =
      (await this._userRepository.findByEmail(payload.email)) ??
      (await this._userRepository.createUser({
        email: payload.email,
        fullName: payload.name,
        avatarUrl: payload.picture,
      }));

    const accessToken = this._tokenService.generateAccessToken({
      email: user.email,
      userId: user.id,
    });
    const refreshToken = this._tokenService.generateRefreshToken({
      email: user.email,
      userId: user.id,
    });
    const refreshTokenHash = this._tokenService.hashToken(refreshToken);
    await this._sessionService.store(
      user.id,
      refreshTokenHash,
      this._refreshTtl,
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
