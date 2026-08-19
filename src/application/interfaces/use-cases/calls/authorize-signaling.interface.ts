export interface IAuthorizeSignalingUseCase {
  execute(dto: {
    callId: string;
    senderId: string;
    targetUserId: string;
  }): Promise<boolean>;
}
