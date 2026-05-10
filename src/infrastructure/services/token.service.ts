import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { UnauthorizedError } from '../../domain/errors/auth.error';
import {
  ITokenService,
  TokenPayload,
} from '../../application/interfaces/services/token.service.interface';
import { config } from '../../config/env.config';

export class JwtTokenService implements ITokenService {
  private readonly _accessSecret: string;
  private readonly _accessExpiry: number;

  constructor() {
    this._accessSecret = config.jwt.accessSecret!;
    this._accessExpiry = parseInt(config.jwt.accessExpiration ?? '900');
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._accessSecret, {
      expiresIn: this._accessExpiry,
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
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
