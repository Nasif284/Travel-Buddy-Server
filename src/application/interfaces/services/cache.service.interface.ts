export interface ICacheService {
  get(key: string): Promise<string | null>;
  set(key: string, ttlSeconds: number, value: string): Promise<void>;
  delete(...keys: string[]): Promise<void>;
  exists(key: string): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;

  ttl(key: string): Promise<number>;
}
