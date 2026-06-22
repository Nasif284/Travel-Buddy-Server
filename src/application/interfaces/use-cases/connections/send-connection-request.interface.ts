import { SendConnectionRequestDTO } from '../../../dtos/connections/requests/send-connection-request.dto';

export interface ISendConnectionRequest {
  execute(dto: SendConnectionRequestDTO): Promise<void>;
}
