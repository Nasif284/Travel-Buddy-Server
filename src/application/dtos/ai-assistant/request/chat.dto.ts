export interface ChatRequestDTO {
  userId: string;
  message: string;
}

export type AssistantRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AssistantMessage {
  role: AssistantRole;
  content: string;
}
export interface AssistantConversation {
  id: string;
  userId: string;
  messages: AssistantMessage[];
}
