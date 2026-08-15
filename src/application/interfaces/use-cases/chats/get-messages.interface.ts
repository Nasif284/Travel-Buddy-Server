import { ChatMessageDTO } from '../../repositories/chat.repository';

export interface IGetChatMessagesUseCase {
  execute(
    userId: string,
    conversationId: string,
    limit?: number,
    cursor?: string,
  ): Promise<ChatMessageDTO[]>;
}
