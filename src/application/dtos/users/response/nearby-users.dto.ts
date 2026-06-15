import { UserWithDetails } from './user-card.dto';

export interface NearbyUsersResponseDTO {
  users: UserWithDetails[];
  total: number;
  page: number;
  limit: number;
}
