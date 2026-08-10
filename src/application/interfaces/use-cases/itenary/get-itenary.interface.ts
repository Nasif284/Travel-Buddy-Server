import { GetGroupItineraryResponseDTO } from '../../../dtos/itenary/response/get-itenary.dto';

export interface IGetGroupItineraryUseCase {
  execute(dto: { groupId: string }): Promise<GetGroupItineraryResponseDTO>;
}
