import {
  AssistantMessage,
  ChatRequestDTO,
} from '../../../dtos/ai-assistant/request/chat.dto';
import { ChatResponseDTO } from '../../../dtos/ai-assistant/response/chat.dto';
export interface AssistantContext {
  conversationId: string;
  user: {
    id: string;
    firstName: string;
  };

  activeTrip: {
    destination: string;
    budgetStyle: string;
    travelStyle: string;
    startDate: string;
    endDate: string;
  } | null;
  recentMessages: AssistantMessage[];
  relevantMessages: AssistantMessage[];
}
export interface IChatAssistantUseCase {
  execute(dto: ChatRequestDTO): Promise<ChatResponseDTO>;
}

export interface IAssistantContextBuilder {
  build(userId: string, message: string): Promise<AssistantContext>;
}
