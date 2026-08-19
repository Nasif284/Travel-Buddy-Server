import { CallDTO } from '../../../dtos/call/request/call.dto';

export interface IJoinDirectCallUseCase {
  execute(callId: string, userId: string): Promise<CallDTO>;
}
