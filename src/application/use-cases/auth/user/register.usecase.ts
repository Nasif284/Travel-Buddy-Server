import { config } from '../../../../config/env.config';
import { EmailAlreadyExistsError } from '../../../../domain/errors/auth.error';
import { RegisterRequestDTO } from '../../../dtos/auth/user/request/register.dto';
import { RegisterResponseDTO } from '../../../dtos/auth/user/responce/register.dto';
import { IUserRepository } from '../../../interfaces/repositories/user.reposetory';
import { IHashService } from '../../../interfaces/services/hash.service.interface';
import { IOtpService } from '../../../interfaces/services/otp.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';

interface Result {
  response: RegisterResponseDTO;
  accessToken: string;
  refreshToken: string;
}

export class Register implements IBaseUseCase<RegisterRequestDTO, Result> {
  private readonly _refreshTtl: number;

  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashService: IHashService,
    private readonly _tokenService: ITokenService,
    private readonly _sessionService: ISessionService,
    private readonly _otpService: IOtpService,
  ) {
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }

  async execute(dto: RegisterRequestDTO): Promise<Result> {
    const isExist = await this._userRepository.findByEmail(dto.email);

    if (isExist) throw new EmailAlreadyExistsError();

    const passwordHash = await this._hashService.hash(dto.password);

    const user = await this._userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
    });
    const accessToken = this._tokenService.generateAccessToken({
      email: user.email,
      userId: user.id,
    });
    const refreshToken = this._tokenService.generateRefreshToken({
      email: user.email,
      userId: user.id,
    });
    const tokenHash = this._tokenService.hashToken(refreshToken);
    await this._sessionService.store(user.id, tokenHash, this._refreshTtl);

    await this._otpService.send(user.email, 'email_verify');

    return {
      accessToken,
      refreshToken,
      response: {
        success: true,
        message: 'Account created successfully.',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      },
    };
  }
}
