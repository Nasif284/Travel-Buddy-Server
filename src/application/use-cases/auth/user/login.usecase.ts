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
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IHashService } from '../../../interfaces/services/hash.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
interface Result {
  accessToken: string;
  refreshToken: string;
  response: LoginResponseDTO;
}
export class LoginUseCase implements IBaseUseCase<LoginRequestDTO, Result> {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _hashService: IHashService,
    private readonly _sessionService: ISessionService,
  ) {
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }
  async execute(dto: LoginRequestDTO): Promise<Result> {
    const { email, password } = dto;
    const user = await this._userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundError();
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
      response: {
        success: true,
        message: 'user logged in successfully',
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
