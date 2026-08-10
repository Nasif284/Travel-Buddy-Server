import { AssistantContext } from '../use-cases/ai-assistant/chat.interface';

export interface IAssistantService {
  chat(context: AssistantContext, message: string): Promise<string>;
}
