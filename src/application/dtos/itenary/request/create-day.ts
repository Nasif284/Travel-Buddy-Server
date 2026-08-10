export interface CreateItineraryDayRequestDTO {
  groupId: string;
  userId: string;
  date: Date;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  summary: string | null;
}
