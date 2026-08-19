import { inject, injectable } from 'tsyringe';

import { ILeaveCallUseCase } from '../../interfaces/use-cases/calls/leave-call.interface';
import { ICallRepository } from '../../interfaces/repositories/call.repository.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { CallDTO } from '../../dtos/call/request/call.dto';
import { ICallNotificationService } from '../../interfaces/services/call-notification.service.interface';

@injectable()
export class LeaveCallUseCase implements ILeaveCallUseCase {
  constructor(
    @inject(TOKENS.ICallRepository)
    private readonly callRepository: ICallRepository,

    @inject(TOKENS.ICallNotificationService)
    private readonly notificationService: ICallNotificationService,
  ) {}

  async execute(callId: string, userId: string): Promise<CallDTO> {
    const call = await this.callRepository.findById(callId);

    if (!call) {
      throw new Error('Call not found.');
    }

    if (call.status === 'ENDED' || call.status === 'CANCELLED') {
      throw new Error('This call has already ended.');
    }

    const participant = await this.callRepository.findParticipant(
      callId,
      userId,
    );

    if (!participant) {
      throw new Error('You are not a participant of this call.');
    }

    if (participant.status === 'LEFT') {
      return this.buildCallDTO(call);
    }

    await this.callRepository.updateParticipantStatus(callId, userId, 'LEFT');

    const participants = await this.callRepository.getParticipants(callId);

    const joinedUserIds = participants
      .filter((participant) => participant.status === 'JOINED')
      .map((participant) => participant.userId);

    let callEnded = false;

    if (call.scope === 'DIRECT') {
      await this.callRepository.updateCallEnded(callId);

      callEnded = true;
    }

    if (call.scope === 'TRIP_GROUP' && joinedUserIds.length === 0) {
      await this.callRepository.updateCallEnded(callId);

      callEnded = true;
    }

    const updatedCall = await this.callRepository.findById(callId);

    if (!updatedCall) {
      throw new Error('Failed to retrieve updated call.');
    }

    if (callEnded) {
      if (call.scope === 'DIRECT') {
        const otherUserId =
          call.callerId === userId ? call.recipientId : call.callerId;

        if (otherUserId) {
          this.notificationService.notifyCallEnded(callId, [otherUserId]);
        }
      }
    } else {
      this.notificationService.notifyParticipantLeft(
        callId,
        userId,
        joinedUserIds,
      );
    }

    return this.buildCallDTO(updatedCall);
  }

  private async buildCallDTO(
    call: Awaited<ReturnType<ICallRepository['findById']>>,
  ): Promise<CallDTO> {
    if (!call) {
      throw new Error('Call not found.');
    }

    const participants = await this.callRepository.getParticipants(call.id);

    return {
      id: call.id,
      scope: call.scope,
      mediaType: call.mediaType,
      status: call.status,

      callerId: call.callerId,
      recipientId: call.recipientId,
      tripGroupId: call.tripGroupId,

      startedAt: call.startedAt,
      endedAt: call.endedAt,
      createdAt: call.createdAt,

      participants: participants.map((participant) => ({
        id: participant.id,
        userId: participant.userId,
        status: participant.status,
        joinedAt: participant.joinedAt,
        leftAt: participant.leftAt,
      })),
    };
  }
}
