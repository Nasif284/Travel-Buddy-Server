import { User } from '../../../../domain/entities/user/user.entity';
export interface GetAllUserResponseDTO {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
