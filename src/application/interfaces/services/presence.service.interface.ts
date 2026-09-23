export interface UserPresenceStatus {
  isOnline: boolean;
  lastSeen?: string;
}

export interface IPresenceService {
  setUserOnline(
    userId: string,
    socketId: string,
  ): Promise<{ isFirstSocket: boolean }>;

  setUserOffline(
    userId: string,
    socketId: string,
  ): Promise<{ isFullyOffline: boolean; lastSeen: string }>;

  getUsersPresence(
    userIds: string[],
  ): Promise<Record<string, UserPresenceStatus>>;

  getUserPresence(userId: string): Promise<UserPresenceStatus>;
}
