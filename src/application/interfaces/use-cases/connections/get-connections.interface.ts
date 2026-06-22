import { GetConnectionsResponseDTO } from '../../../dtos/connections/response/get-connections.dto';

export interface IGetConnections {
  execute(dto: { userId: string }): Promise<GetConnectionsResponseDTO>;
}
