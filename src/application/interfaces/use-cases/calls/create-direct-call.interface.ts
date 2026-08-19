import { CallDTO } from '../../../dtos/call/request/call.dto';
import { CreateDirectCallDTO } from '../../../dtos/call/request/create-direct-call.dto';

export interface ICreateDirectCallUseCase {
  execute(callerId: string, data: CreateDirectCallDTO): Promise<CallDTO>;
}
