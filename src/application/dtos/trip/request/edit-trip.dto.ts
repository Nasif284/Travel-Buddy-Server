export interface EditTripRequestDTO {
  tripId: string;
  dateFrom: Date;
  dateTo: Date;
  budgetStyleCode: string;
  travelStyleCode: string;
  preferredMembers: number;
}
export interface EditTripData {
  dateFrom?: Date;
  dateTo?: Date;
  budgetStyleCode?: string;
  travelStyleCode?: string;
  statusCode?: string;
}
