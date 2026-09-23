export interface IMarkMessagesAsReadUseCase {
  execute(
    userId: string,
    conversationId: string,
  ): Promise<{ count: number; readAt: Date }>;
}
