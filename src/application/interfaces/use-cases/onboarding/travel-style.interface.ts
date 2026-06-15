import { TravelStyleRequestDTO } from '../../../dtos/onbaording/request/travel-style.dto';

export interface ISetTravelStyle {
  execute(dto: TravelStyleRequestDTO): Promise<void>;
}
