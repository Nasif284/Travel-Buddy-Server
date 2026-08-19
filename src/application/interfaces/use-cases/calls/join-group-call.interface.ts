import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface IJoinGroupCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
