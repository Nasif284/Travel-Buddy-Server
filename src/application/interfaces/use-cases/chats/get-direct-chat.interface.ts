export interface IGetDirectChatUseCase {
  execute(userId: string, otherUserId: string): Promise<string>;
}
