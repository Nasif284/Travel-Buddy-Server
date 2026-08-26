import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';

import { TOKENS } from '../../../../infrastructure/di/tokens';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { UnauthorizedError } from '../../../../domain/errors/auth.error';

import { ITokenService } from '../../../../application/interfaces/services/token.service.interface';

@injectable()
export class UserAuthMiddleware {
  constructor(
    @inject(TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.cookies?.accessToken;
      console.log('token');
      console.log('middle-1');
      if (!token) {
        throw new UnauthorizedError();
      }
      console.log('middle-1');
      const payload = this.tokenService.verifyAccessToken(token);
      console.log('middle-');
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
  };
}
