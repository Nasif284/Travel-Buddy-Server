import { inject, injectable } from 'tsyringe';

import { IJoinCallUseCase } from '../../interfaces/use-cases/calls/join-call.interface';
import { IJoinDirectCallUseCase } from '../../interfaces/use-cases/calls/join-direct-call.interface';
import { IJoinGroupCallUseCase } from '../../interfaces/use-cases/calls/join-group-call.interface';

import { ICallRepository } from '../../interfaces/repositories/call.repository.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { CallDTO } from '../../dtos/call/request/call.dto';

@injectable()
export class JoinCallUseCase implements IJoinCallUseCase {
  constructor(
    @inject(TOKENS.ICallRepository)
    private readonly callRepository: ICallRepository,

    @inject(TOKENS.IJoinDirectCallUseCase)
    private readonly joinDirectCallUseCase: IJoinDirectCallUseCase,

    @inject(TOKENS.IJoinGroupCallUseCase)
    private readonly joinGroupCallUseCase: IJoinGroupCallUseCase,
  ) {}

  async execute(callId: string, userId: string): Promise<CallDTO> {
    const call = await this.callRepository.findById(callId);

    if (!call) {
      throw new Error('Call not found.');
    }

    switch (call.scope) {
      case 'DIRECT':
        return this.joinDirectCallUseCase.execute(callId, userId);

      case 'TRIP_GROUP':
        return this.joinGroupCallUseCase.execute(callId, userId);

      default:
        throw new Error('Unsupported call scope.');
    }
  }
}
