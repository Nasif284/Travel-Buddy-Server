import { User } from '../../../../domain/entities/user/user.entity';
import { UserRecord } from '../../../../infrastructure/database/schema';

export interface GetAllUserResponseDTO {
  success: boolean;
  message: string;
  data: {
    users: UserRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
