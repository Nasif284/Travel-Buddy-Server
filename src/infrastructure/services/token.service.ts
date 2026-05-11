import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { UnauthorizedError } from '../../domain/errors/auth.error';
import {
  ITokenService,
  TokenPayload,
} from '../../application/interfaces/services/token.service.interface';
import { config } from '../../config/env.config';
import { StringValue } from 'ms';

export class JwtTokenService implements ITokenService {
  private readonly _accessSecret: string;
  private readonly _refreshSecret: string;
  private readonly _accessExpiry: StringValue;
  private readonly _refreshExpiry: StringValue;

  constructor() {
    this._accessSecret = config.jwt.accessSecret!;
    this._accessExpiry = (config.jwt.accessExpiration ?? '15m') as StringValue;
    this._refreshSecret = config.jwt.refreshSecret!;
    this._refreshExpiry = (config.jwt.refreshExpiration ?? '7d') as StringValue;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._accessSecret, {
      expiresIn: this._accessExpiry,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._refreshSecret, {
      expiresIn: this._refreshExpiry,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this._accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Access token is invalid or expired.');
    }
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
