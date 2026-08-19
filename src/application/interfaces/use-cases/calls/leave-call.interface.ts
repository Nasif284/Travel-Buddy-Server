import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface ILeaveCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
