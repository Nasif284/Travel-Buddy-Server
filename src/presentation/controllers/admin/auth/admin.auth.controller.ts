import { CookieOptions, Request, Response } from 'express';
import { AdminLogin } from '../../../../application/use-cases/auth/admin/login.usecase';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { config } from '../../../../config/env.config';
import { CreateAdmin } from '../../../../application/use-cases/auth/admin/create.usecase';
import { Logout } from '../../../../application/use-cases/auth/user/logout.usecase';
import jwt from 'jsonwebtoken';
import { AdminRefreshToken } from '../../../../application/use-cases/auth/admin/admin-refresh.usercase';
import ms, { StringValue } from 'ms';
import { ApiResponse } from '../../../responses/common-response';
import { ADMIN_MESSAGES } from '../../../../shared/constants/messages/success/admin/admin.messages';
import { AUTH_ERROR_CODES } from '../../../../shared/constants/error-codes/auth.code';
import { AUTH_ERROR_MESSAGES } from '../../../../shared/constants/messages/error/auth.messages';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
@injectable()
export class AdminAuthController {
  private readonly _accessTtl: number;
  private readonly _refreshTtl: number;

  constructor(
    @inject(TOKENS.IAdminLogin) private readonly _loginUseCase: AdminLogin,
    @inject(TOKENS.ICreateAdmin)
    private readonly _createAdminUseCase: CreateAdmin,
    @inject(TOKENS.ILogout) private readonly _logoutUseCase: Logout,
    @inject(TOKENS.IAdminRefreshToken)
    private readonly _refreshUseCase: AdminRefreshToken,
  ) {
    this._accessTtl = ms((config.jwt.accessExpiration ?? '15m') as StringValue);
    this._refreshTtl = ms(
      (config.jwt.refreshExpiration ?? '7d') as StringValue,
    );
  }

  private getCookieOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      secure: config.env == 'development' ? false : true,
      sameSite: 'lax',
      path: '/',
      maxAge,
    };
  }

  private getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: config.env == 'development' ? false : true,
      sameSite: 'lax',
      path: '/',
    };
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._loginUseCase.execute(req.body);
    res.cookie(
      'accessToken',
      result.accessToken,
      this.getCookieOptions(this._accessTtl),
    );
    res.cookie(
      'refreshToken',
      result.refreshToken,
      this.getCookieOptions(this._refreshTtl),
    );
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.LOGGED_ID, result.user));
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._createAdminUseCase.execute(req.body);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.CREATED, result.admin));
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const userId = req.user?.userId;
    if (userId && refreshToken) {
      await this._logoutUseCase.execute({ userId, refreshToken });
    }
    res.clearCookie('accessToken', this.getClearCookieOptions());
    res.clearCookie('refreshToken', this.getClearCookieOptions());
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.LOGGED_OUT));
  };
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          ApiResponse.error(
            AUTH_ERROR_CODES.INVALID_REFRESH_TOKEN,
            AUTH_ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
          ),
        );
    }
    const decoded = (await jwt.decode(refreshToken)) as {
      userId: string;
      email: string;
    } | null;
    const userId: string | undefined = decoded?.userId;
    if (!userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(
          ApiResponse.error(
            AUTH_ERROR_CODES.USER_NOT_FOUND,
            AUTH_ERROR_MESSAGES.USER_NOT_FOUND,
          ),
        );
    }
    const result = await this._refreshUseCase.execute({
      token: refreshToken,
      userId,
    });
    res.cookie(
      'accessToken',
      result.accessToken,
      this.getCookieOptions(this._accessTtl),
    );
    res.cookie(
      'refreshToken',
      result.refreshToken,
      this.getCookieOptions(this._refreshTtl),
    );

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.REFRESH_TOKEN, result.user));
  };
}
