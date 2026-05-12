import { User } from '../../../domain/entities/user/user.entity';
import { UserRecord } from '../../../infrastructure/database/schema';
import { GetAllUsersRequestDTO } from '../../dtos/user-management/request/get-users.dto';

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateEmailVerified(email: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
  getAllUsers(
    payload: GetAllUsersRequestDTO,
  ): Promise<{ users: UserRecord[]; count: number } | null>;
}
