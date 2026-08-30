import ms, { StringValue } from 'ms';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { verifyGoogleToken } from '../../../../infrastructure/services/google-auth.service';
import { AppError } from '../../../../presentation/Errors/app.error';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { config } from '../../../../config/env.config';
import { IGoogleAuth } from '../../../interfaces/use-cases/auth/user/google-auth.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { GoogleAuthResponseDTO } from '../../../dtos/auth/user/responce/google-auth.dto';
@injectable()
export class GoogleAuth implements IGoogleAuth {
  private readonly _refreshTtl: number;
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,
    @inject(TOKENS.ISessionService)
    private readonly _sessionService: ISessionService,
  ) {
    this._refreshTtl = this._refreshTtl =
      ms((config.jwt.refreshExpiration ?? '7d') as StringValue) / 1000;
  }
  async execute(dto: { token: string }): Promise<GoogleAuthResponseDTO> {
    const { token } = dto;
    const payload = await verifyGoogleToken(token);
    let user;
    let isNew = false;
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
    user = await this._userRepository.findByEmail(payload.email, {
      onboarding: true,
    });
    if (!user) {
      user = await this._userRepository.createUser({
        email: payload.email,
        fullName: payload.name,
        isEmailVerified: true,
      });
      isNew = true;
    }

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
        isVerified: user.isEmailVerified,
        onboardingCompleted: user.onboarding.onboardingCompleted,
        onboardingStep: user.onboarding.onboardingStep,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
      },
      isNew,
    };
  }
}
