export interface GetGroupItineraryResponseDTO {
  groupId: string;
  days: ItineraryDayDTO[];
}
export interface ItineraryDayDTO {
  id: string;
  date: Date;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
  activities: ItineraryActivityDTO[] | [];
}
export interface ItineraryActivityDTO {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  category: {
    code: string;
    name: string;
  };
  startTime: string | null;
  durationMinutes: number | null;
  notes: string | null;
  isCompleted: boolean;
  createdBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface GroupItineraryRepositoryResponse {
  id: string;
  itineraryDays: ItineraryDayRepositoryResponse[];
}

export interface ItineraryDayRepositoryResponse {
  id: string;
  date: Date;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
  activities: ItineraryActivityRepositoryResponse[];
}

export interface ItineraryActivityRepositoryResponse {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  startTime: string | null;
  durationMinutes: number | null;
  notes: string | null;
  sortOrder: number;
  isCompleted: boolean;
  category: {
    code: string;
    name: string;
  };
  creator: {
    id: string;
    user: {
      fullName: string;
      avatarUrl: string | null;
    };
  };
}
