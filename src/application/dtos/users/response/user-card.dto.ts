export interface UserWithDetails {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  age: number | null;
  city: string | null;
  country: string | null;
  travelType: string | null;
  travelPersonality: string | null;
  interests: string[];
  distanceKm?: number;
}
export interface UserCardDetailsResponseDTO {
  users: UserWithDetails[];
  total: number;
  page: number;
  limit: number;
}
