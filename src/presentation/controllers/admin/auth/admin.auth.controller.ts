import { CookieOptions, Request, Response } from 'express';
import { AdminLogin } from '../../../../application/use-cases/auth/admin/login.usecase';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { config } from '../../../../config/env.config';
import { CreateAdmin } from '../../../../application/use-cases/auth/admin/create.usecase';
import { Logout } from '../../../../application/use-cases/auth/user/logout.usecase';
import jwt from 'jsonwebtoken';
import { AdminRefreshToken } from '../../../../application/use-cases/auth/admin/admin-refresh.usercase';
function getCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: config.env == 'development' ? false : true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

function getClearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.env == 'development' ? false : true,
    sameSite: 'lax',
    path: '/',
  };
}
export class AdminAuthController {
  private readonly _accessTtl: number;
  private readonly _refreshTtl: number;

  constructor(
    private readonly _loginUseCase: AdminLogin,
    private readonly _createAdminUseCase: CreateAdmin,
    private readonly _logoutUseCase: Logout,
    private readonly _refreshUseCase: AdminRefreshToken,
  ) {
    this._accessTtl = 15 * 60 * 1000;
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._loginUseCase.execute(req.body);
    res.cookie(
      'accessToken',
      result.accessToken,
      getCookieOptions(this._accessTtl),
    );
    res.cookie(
      'refreshToken',
      result.refreshToken,
      getCookieOptions(this._refreshTtl),
    );
    return res.status(HttpStatus.OK).json(result.response);
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._createAdminUseCase.execute(req.body);
    return res.status(HttpStatus.OK).json(result);
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const userId = req.user?.userId;
    let result;
    if (userId && refreshToken) {
      result = await this._logoutUseCase.execute({ userId, refreshToken });
    }

    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(HttpStatus.OK).json(result);
  };
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Session expired, login again',
      });
    }
    const decoded = (await jwt.decode(refreshToken)) as {
      userId: string;
      email: string;
    } | null;
    const userId: string | undefined = decoded?.userId;
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User id is missing',
      });
    }
    const result = await this._refreshUseCase.execute({
      token: refreshToken,
      userId,
    });
    res.cookie(
      'accessToken',
      result.accessToken,
      getCookieOptions(this._accessTtl),
    );
    res.cookie(
      'refreshToken',
      result.refreshToken,
      getCookieOptions(this._refreshTtl),
    );

    return res.status(HttpStatus.OK).json(result.response);
  };
}
