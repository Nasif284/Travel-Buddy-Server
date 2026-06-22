export interface TripMatch {
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    coverUrl: string | null;
    age: number | null;
    city: string | null;
    country: string | null;
    state: string | null;
    travelPersonality: string | null;
    interests: string[];
  };
  tripMatch: {
    id: string;
    matchedTripId: string;
    totalPoints: number;
    dateFrom: Date;
    dateTo: Date;
    destination: string;
  };
}

export interface TripMatchResponseDTO {
  matches: TripMatch[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}
