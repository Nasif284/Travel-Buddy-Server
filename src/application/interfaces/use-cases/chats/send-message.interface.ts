import { ChatMessageDTO } from '../../repositories/chat.repository';

export interface ISendChatMessageUseCase {
  execute(
    userId: string,
    conversationId: string,
    content: string,
  ): Promise<ChatMessageDTO>;
}
