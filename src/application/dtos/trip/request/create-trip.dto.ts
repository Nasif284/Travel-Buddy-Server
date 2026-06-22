export interface CreateTripRequestDTO {
  userId: string;
  name: string;
  placeId: string;
  destinationName: string;
  city: string;
  state: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  dateFrom: Date;
  dateTo: Date;
  budgetStyle: string;
  travelStyleCode: string;
  preferredMembers: number;
}

export interface CreateTripDataDTO {
  name: string;
  destinationId: string;
  dateFrom: Date;
  dateTo: Date;
  budgetStyle: string;
  travelStyleCode: string;
  preferredMembers: number;
  createdBy: string;
  inviteCode: string;
}
