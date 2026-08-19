import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface ICancelDirectCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
