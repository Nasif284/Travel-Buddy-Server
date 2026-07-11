import { TravelStyleRequestDTO } from '../../../dtos/onbaording/request/travel-style.dto';

export interface IEditTravelStyle {
  execute(dot: TravelStyleRequestDTO): Promise<void>;
}
