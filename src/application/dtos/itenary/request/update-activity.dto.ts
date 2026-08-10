export interface UpdateItineraryActivityRequestDTO {
  activityId: string;
  title?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  categoryCode?: string;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
}
