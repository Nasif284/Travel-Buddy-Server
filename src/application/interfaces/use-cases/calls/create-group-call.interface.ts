import { CallDTO } from '../../../dtos/call/request/call.dto';
import { CreateGroupCallDTO } from '../../../dtos/call/request/create-group-call.dto';

export interface ICreateGroupCallUseCase {
  execute(callerId: string, data: CreateGroupCallDTO): Promise<CallDTO>;
}
