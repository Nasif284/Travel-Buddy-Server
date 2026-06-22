import { MatchDestinationDTO } from './calculate-mathc.dto';

export interface GetActiveTripResponseDTO {
  id: string;
  name: string;
  destinationId: string;
  dateFrom: Date;
  dateTo: Date;
  budgetStyleCode: string;
  travelStyleCode: string;
  destination: MatchDestinationDTO;
}
