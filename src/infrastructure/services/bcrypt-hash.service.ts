import bcrypt from 'bcrypt';
import { IHashService } from '../../application/interfaces/services/hash.service.interface';
import { injectable } from 'tsyringe';
const SALT_ROUNDS = 12;
@injectable()
export class BcryptHashService implements IHashService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
