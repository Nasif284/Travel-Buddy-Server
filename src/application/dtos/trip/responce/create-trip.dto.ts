export interface CreateTripResponseDTO {
  userId: string;
  name: string;
  destinationId: string;
  destinationName: string;
  city: string;
  state: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  dateFrom: Date;
  dateTo: Date;
  budgetStyle?: string;
  travelStyleCode?: string;
  preferredMembers?: number;
  createdBy: string;
}
