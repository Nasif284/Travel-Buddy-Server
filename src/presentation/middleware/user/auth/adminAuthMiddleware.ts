import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../../../domain/errors/auth.error';
import { JwtTokenService } from '../../../../infrastructure/services';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
const tokenService = new JwtTokenService();
export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const token = req.cookies?.adminAccessToken as string | undefined;
    if (!token) throw new UnauthorizedError();
    const payload = tokenService.verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (err) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: err instanceof Error ? err.message : 'Unauthorized.',
      },
    });
  }
}
