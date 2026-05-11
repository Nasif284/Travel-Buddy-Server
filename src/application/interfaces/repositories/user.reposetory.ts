import { User } from '../../../domain/entities/user/user.entity';

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateEmailVerified(email: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
}
