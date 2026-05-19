import ms, { StringValue } from 'ms';
import { config } from '../../../../config/env.config';
import { AdminNotFoundError } from '../../../../domain/errors/admin.error';
import { IncorrectPasswordError } from '../../../../domain/errors/auth.error';
import { LoginRequestDTO } from '../../../dtos/auth/user/request/login.dto';
import { LoginResponseDTO } from '../../../dtos/auth/user/responce/login.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IAdminRepository } from '../../../interfaces/repositories/admin.respository';
import { IHashService } from '../../../interfaces/services/hash.service.interface';
import { ISessionService } from '../../../interfaces/services/session.service.interface';
import { ITokenService } from '../../../interfaces/services/token.service.interface';
export interface Result {
  accessToken: string;
  refreshToken: string;
  response: LoginResponseDTO;
}
export class AdminLogin implements IBaseUseCase<LoginRequestDTO, Result> {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _tokenService: ITokenService,
    private readonly _sessionService: ISessionService,
    private readonly _hashService: IHashService,
  ) {
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }
  async execute(dto: LoginRequestDTO): Promise<Result> {
    const { email, password } = dto;
    const admin = await this._adminRepository.findByEmail(email);
    if (!admin) {
      throw new AdminNotFoundError();
    }
    const valid = await this._hashService.compare(password, admin.passwordHash);
    if (!valid) {
      throw new IncorrectPasswordError();
    }

    const accessToken = this._tokenService.generateAccessToken({
      userId: admin.id,
      email: admin.email,
    });
    const refreshToken = this._tokenService.generateRefreshToken({
      userId: admin.id,
      email: admin.email,
    });

    const tokenHash = await this._hashService.hash(refreshToken);
    await this._sessionService.store(admin.id, tokenHash, this._refreshTtl);

    return {
      accessToken,
      refreshToken,
      response: {
        success: true,
        message: 'admin logged in successfully',
        data: {
          user: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
          },
        },
      },
    };
  }
}
