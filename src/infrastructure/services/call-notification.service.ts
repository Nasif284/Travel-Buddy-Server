import { Server } from 'socket.io';
import { inject, injectable } from 'tsyringe';

import {
  CallDeclinedNotification,
  GroupCallNotification,
  ICallNotificationService,
  IncomingCallNotification,
  ParticipantJoinedNotification,
} from '../../application/interfaces/services/call-notification.service.interface';

import { TOKENS } from '../di/tokens';

@injectable()
export class CallNotificationService implements ICallNotificationService {
  constructor(
    @inject(TOKENS.Socket)
    private readonly io: Server,
  ) {}

  notifyIncomingCall(
    recipientId: string,
    data: IncomingCallNotification,
  ): void {
    this.io.to(`user:${recipientId}`).emit('call:incoming', data);
  }

  notifyParticipantJoined(
    callId: string,
    participantUserId: string,
    recipientUserId: string,
  ): void {
    const data: ParticipantJoinedNotification = {
      callId,
      userId: participantUserId,
    };

    this.io.to(`user:${recipientUserId}`).emit('call:participant-joined', data);
  }

  notifyGroupParticipantJoined(
    callId: string,
    participantUserId: string,
    name: string,
    avatarUrl: string,
    participantUserIds: string[],
  ): void {
    const data: ParticipantJoinedNotification = {
      callId,
      userId: participantUserId,
      name,
      profileImage: avatarUrl,
    };

    for (const userId of participantUserIds) {
      if (userId === participantUserId) {
        continue;
      }

      this.io.to(`user:${userId}`).emit('call:participant-joined', data);
    }
  }

  notifyIncomingGroupCall(
    recipientIds: string[],
    data: GroupCallNotification,
  ): void {
    for (const userId of recipientIds) {
      this.io.to(`user:${userId}`).emit('call:group-incoming', data);
    }
  }

  notifyParticipantLeft(
    callId: string,
    participantUserId: string,
    recipientUserIds: string[],
  ): void {
    const data = {
      callId,
      userId: participantUserId,
    };

    for (const userId of recipientUserIds) {
      this.io.to(`user:${userId}`).emit('call:participant-left', data);
    }
  }

  notifyCallEnded(callId: string, recipientUserIds: string[]): void {
    for (const userId of recipientUserIds) {
      this.io.to(`user:${userId}`).emit('call:ended', {
        callId,
      });
    }
  }

  notifyCallDeclined(
    callId: string,
    participantUserId: string,
    callerUserId: string,
  ): void {
    const data: CallDeclinedNotification = {
      callId,
      userId: participantUserId,
    };

    this.io.to(`user:${callerUserId}`).emit('call:declined', data);
  }

  notifyCallCancelled(
    callId: string,
    callerId: string,
    recipientUserIds: string[],
  ): void {
    const data = {
      callId,
      callerId,
    };

    for (const userId of recipientUserIds) {
      this.io.to(`user:${userId}`).emit('call:cancelled', data);
    }
  }
}
