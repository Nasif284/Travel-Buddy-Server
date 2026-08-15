export interface IJoinChatConversationValidationUseCase {
  execute(userId: string, conversationId: string): Promise<void>;
}
