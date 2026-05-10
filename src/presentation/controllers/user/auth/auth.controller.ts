import { Request, Response } from 'express';
import { CookieOptions } from 'express';
import { Register } from '../../../../application/use-cases/auth';
import { config } from '../../../../config/env.config';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { EmailVerification } from '../../../../application/use-cases/auth/verify-email.usecase';
function getCookieOptions(maxAgeSeconds: number): CookieOptions {
  return {
    httpOnly: true,
    secure: config.env == 'development' ? false : true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds * 1000,
  };
}

export class AuthController {
  private readonly _accessTtl: number;
  private readonly _refreshTtl: number;

  constructor(
    private readonly _registerUseCase: Register,
    private readonly _verifyEmailUseCase: EmailVerification,
  ) {
    this._accessTtl = parseInt(config.jwt.accessExpiration ?? '900');
    this._refreshTtl = parseInt(config.jwt.refreshExpiration ?? '2592000');
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    console.log(config.env == 'development');
    const result = await this._registerUseCase.execute(req.body);
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

    return res.status(HttpStatus.CREATED).json(result.response);
  };
  verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.user;
    const { code } = req.body;
    const result = await this._verifyEmailUseCase.execute({ email, code });
    return res.status(HttpStatus.OK).json(result);
  };
}
