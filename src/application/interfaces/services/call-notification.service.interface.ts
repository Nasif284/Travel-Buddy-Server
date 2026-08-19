import { CallMediaType } from '../../dtos/call/request/call.dto';

export interface IncomingCallNotification {
  callId: string;
  callerId: string;
  callerName: string;
  callerProfileImage: string | null;
  mediaType: CallMediaType;
}
export interface CallDeclinedNotification {
  callId: string;
  userId: string;
}
export interface ParticipantJoinedNotification {
  callId: string;
  userId: string;
  name?: string;
  profileImage?: string | null;
}

export interface GroupCallNotification {
  callId: string;
  tripGroupId: string;
  groupName: string;
  groupCoverUrl: string;
  callerId: string;
  callerName: string;
  callerProfileImage: string | null;
  mediaType: CallMediaType;
}

export interface ICallNotificationService {
  notifyIncomingCall(recipientId: string, data: IncomingCallNotification): void;

  notifyIncomingGroupCall(
    recipientIds: string[],
    data: GroupCallNotification,
  ): void;

  notifyParticipantJoined(
    callId: string,
    participantUserId: string,
    recipientUserId: string,
  ): void;
  notifyGroupParticipantJoined(
    callId: string,
    participantUserId: string,
    name: string,
    avatarUrl: string,
    participantUserIds: string[],
  ): void;
  notifyParticipantLeft(
    callId: string,
    participantUserId: string,
    recipientUserIds: string[],
  ): void;

  notifyCallEnded(callId: string, recipientUserIds: string[]): void;
  notifyCallDeclined(
    callId: string,
    participantUserId: string,
    callerUserId: string,
  ): void;
  notifyCallCancelled(
    callId: string,
    callerId: string,
    recipientIds: string[],
  ): void;
}
