export interface UpdateItineraryDayRequestDTO {
  dayId: string;
  date?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  summary?: string;
}
