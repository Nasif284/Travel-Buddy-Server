import { Request, Response } from 'express';
import { CookieOptions } from 'express';
import { Register } from '../../../../application/use-cases/auth/user';
import { config } from '../../../../config/env.config';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { EmailVerification } from '../../../../application/use-cases/auth/user/verify-email.usecase';
import { LoginUseCase } from '../../../../application/use-cases/auth/user/login.usecase';
import { ForgotPassword } from '../../../../application/use-cases/auth/user/forgot-password.usecase';
import { ResetPassword } from '../../../../application/use-cases/auth/user/reset-password.usecase';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../../../../application/use-cases/auth/user/refresh-tokem.usecase';
import { SendOtp } from '../../../../application/use-cases/auth/user/send-otp.usecase';
import { Logout } from '../../../../application/use-cases/auth/user/logout.usecase';
import { VerifyOtp } from '../../../../application/use-cases/auth/user/otp-verify.usecase';
import { GoogleAuth } from '../../../../application/use-cases/auth/user/google-auth.usecase';
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

export class AuthController {
  private readonly _accessTtl: number;
  private readonly _refreshTtl: number;

  constructor(
    private readonly _registerUseCase: Register,
    private readonly _verifyEmailUseCase: EmailVerification,
    private readonly _loginUseCase: LoginUseCase,
    private readonly _forgotPasswordUseCase: ForgotPassword,
    private readonly _resetPasswordUseCase: ResetPassword,
    private readonly _refreshTokenUseCase: RefreshToken,
    private readonly _sendOtp: SendOtp,
    private readonly _logout: Logout,
    private readonly _verifyOtp: VerifyOtp,
    private readonly _googleAuth: GoogleAuth,
  ) {
    this._accessTtl = 15 * 60 * 1000;
    this._refreshTtl = 7 * 24 * 60 * 60 * 1000;
  }

  register = async (req: Request, res: Response): Promise<Response> => {
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
    const { code, email } = req.body;
    const result = await this._verifyEmailUseCase.execute({ email, code });
    return res.status(HttpStatus.OK).json(result);
  };
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

    const result = await this._refreshTokenUseCase.execute({
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

  forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._forgotPasswordUseCase.execute(req.body);
    return res.status(HttpStatus.OK).json(result);
  };

  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._resetPasswordUseCase.execute(req.body);
    return res.status(HttpStatus.OK).json(result);
  };

  sendOtp = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._sendOtp.execute(req.body);
    return res.status(HttpStatus.OK).json(result);
  };

  logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const userId = req.user?.userId;
    let result;
    if (userId && refreshToken) {
      result = await this._logout.execute({ userId, refreshToken });
    }

    res.clearCookie('accessToken', getClearCookieOptions());
    res.clearCookie('refreshToken', getClearCookieOptions());

    return res.status(HttpStatus.OK).json(result);
  };

  verifyOtp = async (req: Request, res: Response): Promise<Response> => {
    const result = await this._verifyOtp.execute(req.body);
    return res.status(HttpStatus.OK).json(result);
  };
  googleAuth = async (req: Request, res: Response) => {
    const { token } = req.body;
    const result = await this._googleAuth.execute({ token });

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
