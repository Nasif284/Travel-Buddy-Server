export interface TokenPayload {
  userId: string;
  email: string;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(): string;
  verifyAccessToken(token: string): TokenPayload;
  hashToken(token: string): string;
}
