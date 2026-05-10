import { NextFunction, Request, Response } from 'express';
import { token } from 'morgan';
import { UnauthorizedError } from '../../../../domain/errors/auth.error';
import { JwtTokenService } from '../../../../infrastructure/services';
const tokenService = new JwtTokenService()
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
    const token = req.cookies?.accessToken as string | undefined
    if (!token) throw new UnauthorizedError("Access token is missing")
    const payload = tokenService.verifyAccessToken(token)
    req.user = {
        u
    }
}
