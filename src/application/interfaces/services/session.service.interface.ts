export interface ISessionService {
  store(userId: string, tokenHash: string, ttlSeconds: number): Promise<void>;
  isValid(userId: string, tokenHash: string): Promise<boolean>;
  revoke(userId: string, tokenHash: string): Promise<void>;
  revokeAll(userId: string): Promise<void>;
}
