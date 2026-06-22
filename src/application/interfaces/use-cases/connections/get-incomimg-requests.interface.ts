import { GetIncomingRequestsResponseDTO } from '../../../dtos/connections/response/get-requests.dto';

export interface IGetIncomingRequests {
  execute(dto: { userId: string }): Promise<GetIncomingRequestsResponseDTO>;
}
