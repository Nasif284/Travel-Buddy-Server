import { GetAllUsersRequestDTO } from '../../dtos/user-management/request/get-users.dto';

import { User } from '../../../domain/entities/user/user.entity';
import { ChangeUserStatusRequestDTO } from '../../dtos/user-management/request/change-status.dto';

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
}

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  createUser(data: CreateUserData): Promise<User>;

  updateEmailVerified(email: string): Promise<void>;

  updatePassword(id: string, password: string): Promise<void>;

  getAllUsers(payload: GetAllUsersRequestDTO): Promise<{
    users: User[];
    count: number;
  }>;
  changeUserStatus(payload: ChangeUserStatusRequestDTO): Promise<void>;
}
