export interface GeneratedActivity {
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  category: string;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
}

export interface GeneratedDay {
  date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  summary?: string;
  activities: GeneratedActivity[];
}

export interface GeneratedItinerary {
  days: GeneratedDay[];
}
