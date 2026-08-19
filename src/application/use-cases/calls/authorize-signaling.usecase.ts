import { inject, injectable } from 'tsyringe';
import { IAuthorizeSignalingUseCase } from '../../interfaces/use-cases/calls/authorize-signaling.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ICallRepository } from '../../interfaces/repositories/call.repository.interface';
@injectable()
export class AuthorizeSignalingUseCase implements IAuthorizeSignalingUseCase {
  constructor(
    @inject(TOKENS.ICallRepository)
    private readonly callRepository: ICallRepository,
  ) {}
  async execute(dto: {
    callId: string;
    senderId: string;
    targetUserId: string;
  }): Promise<boolean> {
    const { callId, senderId, targetUserId } = dto;
    const sender = await this.callRepository.findParticipant(callId, senderId);
    const target = await this.callRepository.findParticipant(
      callId,
      targetUserId,
    );

    if (!sender || !target) {
      return false;
    }

    return true;
  }
}
