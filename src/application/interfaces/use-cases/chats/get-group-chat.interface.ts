export interface IGetGroupChatUseCase {
  execute(userId: string, groupId: string): Promise<string>;
}
