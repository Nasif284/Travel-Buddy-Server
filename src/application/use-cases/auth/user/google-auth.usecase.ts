import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import {
  JwtTokenService,
  RedisSessionService,
} from '../../../../infrastructure/services';
import { verifyGoogleToken } from '../../../../infrastructure/services/google-auth.service';
import { AppError } from '../../../../presentation/Errors/app.error';
import { LoginResponseDTO } from '../../../dtos/auth/user/responce/login.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
interface Result {
  accessToken: string;
  refreshToken: string;
  response: LoginResponseDTO;
}
export class GoogleAuth {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: JwtTokenService,
    private readonly _sessionService: RedisSessionService,
  ) {
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }
  async execute(dto: { token: string }): Promise<Result> {
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
      (await this._userRepository.create({
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
      response: {
        success: true,
        message: 'google authentication successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
          },
        },
      },
    };
  }
}
