import { GetSentRequestsResponseDTO } from '../../../dtos/connections/response/get-sent-requests.dto';

export interface IGetSentRequests {
  execute(dot: { userId: string }): Promise<GetSentRequestsResponseDTO>;
}
