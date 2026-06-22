import { GetAllRequestsResponseDTO } from '../../../dtos/connections/response/get-all-requests.dto';

export interface IGetAllRequests {
  execute(dto: { userId: string }): Promise<GetAllRequestsResponseDTO>;
}
