import { AdminNotFoundError } from '../../../../domain/errors/admin.error';
import { IncorrectPasswordError } from '../../../../domain/errors/auth.error';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../../../infrastructure/services';
import { LoginRequestDTO } from '../../../dtos/auth/request/login.dto';
import { LoginResponseDTO } from '../../../dtos/auth/responce/login.dto';
import { IBaseUseCase } from '../../../interfaces/base-usecase.interface';
import { IAdminRepository } from '../../../interfaces/repositories/admin.respository';
export interface Result {
  accessToken: string;
  refreshToken: string;
  response: LoginResponseDTO;
}
export class AdminLogin implements IBaseUseCase<LoginRequestDTO, Result> {
  private readonly _refreshTtl: number;
  constructor(
    private readonly _adminRepository: IAdminRepository,
    private readonly _tokenService: JwtTokenService,
    private readonly _sessionService: RedisSessionService,
    private readonly _hashService: BcryptHashService,
  ) {
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
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
