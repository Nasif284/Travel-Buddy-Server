import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface IDeclineDirectCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
