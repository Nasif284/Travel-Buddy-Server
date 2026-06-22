export interface TripForMatchingDTO {
  id: string;
  destinationId: string;
  dateFrom: Date;
  dateTo: Date;
  budgetStyleCode: string;
  travelStyleCode: string;
  destination: MatchDestinationDTO;
  creator: MatchUserProfileDTO;
}
export interface SaveTripMatchDTO {
  sourceTripId: string;
  targetTripId: string;

  destinationScore: number;
  dateScore: number;
  travelStyleScore: number;
  budgetScore: number;
  personalityScore: number;
  languageScore: number;
  interestScore: number;

  totalScore: number;

  explanation: {
    reasons: string[];
  };
}

export interface MatchDestinationDTO {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  coverUrl: string | null;
}
export interface MatchInterestDTO {
  interestCode: string;
}

export interface MatchLanguageDTO {
  languageCode: string;
}

export interface MatchUserProfileDTO {
  id: string;
  travelPersonalityCode: string | null;
  interests: MatchInterestDTO[];
  languages: MatchLanguageDTO[];
}
