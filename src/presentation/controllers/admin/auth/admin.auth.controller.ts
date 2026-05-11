import { CookieOptions, Request, Response } from 'express';
import { AdminLogin } from '../../../../application/use-cases/auth/admin/login.usecase';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { config } from '../../../../config/env.config';
import { CreateAdmin } from '../../../../application/use-cases/auth/admin/create.usecase';
function getCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: config.env == 'development' ? false : true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}
export class AdminAuthController {
  private readonly _accessTtl: number;
  private readonly _refreshTtl: number;

  constructor(
    private readonly _loginUseCase: AdminLogin,
    private readonly _createAdminUseCase: CreateAdmin,
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
}
