export interface GetNearbyUsersRequestDTO {
  userId: string;
  page: number;
  limit: number;
  radiusKm?: number;
}
