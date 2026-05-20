import ms, { StringValue } from 'ms';
import { config } from '../../../../config/env.config';
import { AccountStatus } from '../../../../domain/enums';
import {
  AccountBannedError,
  AccountSuspendedError,
  IncorrectPasswordError,
  UserNotFoundError,
  UserNotVerifiedError,
} from '../../../../domain/errors/auth.error';
import { LoginRequestDTO } from '../../../dtos/auth/user/request/login.dto';
import { LoginResponseDTO } from '../../../dtos/auth/user/responce/login.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IHashService } from '../../../interfaces/services/hash.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { ILogin } from '../../../interfaces/use-cases/auth/user/login.interface';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class LoginUseCase implements ILogin {
  private readonly _refreshTtl: number;
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.ITokenService)
    private readonly _tokenService: ITokenService,
    @inject(TOKENS.IHashService)
    private readonly _hashService: IHashService,
    @inject(TOKENS.ISessionService)
    private readonly _sessionService: ISessionService,
  ) {
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }
  async execute(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = dto;
    const user = await this._userRepository.findByEmail(email);

    if (!user || !user.passwordHash) throw new UserNotFoundError();

    const valid = await this._hashService.compare(password, user.passwordHash);
    if (!valid) throw new IncorrectPasswordError();
    if (user.accountStatusCode == AccountStatus.BANNED) {
      throw new AccountBannedError();
    }
    if (!user.isEmailVerified) {
      throw new UserNotVerifiedError();
    }
    if (user.accountStatusCode == AccountStatus.SUSPENDED) {
      throw new AccountSuspendedError();
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

      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
