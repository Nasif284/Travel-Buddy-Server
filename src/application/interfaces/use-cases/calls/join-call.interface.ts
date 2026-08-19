import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface IJoinCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
