import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';

import { TOKENS } from '../../../../infrastructure/di/tokens';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { UnauthorizedError } from '../../../../domain/errors/auth.error';

import { ITokenService } from '../../../../application/interfaces/services/token.service.interface';
import { ISaveAdminActivity } from '../../../../application/interfaces/use-cases/admins/admin-activity.interface';

@injectable()
export class AdminAuthMiddleware {
  constructor(
    @inject(TOKENS.ITokenService)
    private readonly tokenService: ITokenService,

    @inject(TOKENS.ISaveAdminActivity)
    private readonly saveAdminActivity: ISaveAdminActivity,
  ) {}

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.cookies?.adminAccessToken;
      if (!token) {
        throw new UnauthorizedError();
      }

      const payload = this.tokenService.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };

      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        req.socket.remoteAddress ||
        '';

      await this.saveAdminActivity.execute({
        adminId: payload.userId,
        ip: ip.startsWith('::ffff:') ? ip.slice(7) : ip,
      });

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
