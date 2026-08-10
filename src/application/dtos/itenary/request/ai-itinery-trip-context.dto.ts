export interface DestinationContext {
  placeId: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

export interface TripContext {
  startDate: string;
  endDate: string;
  travellers: number;
}

export interface PreferenceContext {
  tripPace: string;
  budgetStyle: string;
  travelStyle: string;
  interests: string[];
}

export interface TripPlanningContext {
  destination: DestinationContext;
  trip: TripContext;
  preferences: PreferenceContext;
  notes?: string;
}
