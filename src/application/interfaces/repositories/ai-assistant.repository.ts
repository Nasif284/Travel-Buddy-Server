import { AssistantMessage } from '../../dtos/ai-assistant/request/chat.dto';
import { AssistantChat } from '../../dtos/ai-assistant/response/get-chata.dto';

export interface IAssistantRepository {
  getOrCreateConversation(userId: string): Promise<string>;
  getMessages(userId: string): Promise<AssistantChat[]>;
  saveMessages(
    conversationId: string,
    messages: AssistantMessage[],
  ): Promise<void>;
  getRecentMessages(
    conversationId: string,
    limit: number,
  ): Promise<AssistantMessage[]>;
}
