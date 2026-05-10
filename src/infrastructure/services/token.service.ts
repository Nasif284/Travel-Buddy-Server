import jwt from 'jsonwebtoken';
import crypto from "crypto"

import { UnauthorizedError } from '../../domain/errors/auth.error';
import { ITokenService, TokenPayload } from '../../application/interfaces/services/token.service.interface';
import { config } from '../../config/env.config';

export class JwtTokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly accessExpiry: number;

  constructor() {
    this.accessSecret = config.jwt.accessSecret!;
    this.accessExpiry = parseInt(
      process.env.JWT_ACCESS_EXPIRY_SECONDS ?? '900',
    );
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry,
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError('Access token is invalid or expired.');
    }
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
