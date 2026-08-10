import { Annotation } from '@langchain/langgraph';
import { AssistantContext } from '../../../application/interfaces/use-cases/ai-assistant/chat.interface';

export const AssistantState = Annotation.Root({
  context: Annotation<AssistantContext>(),
  userMessage: Annotation<string>(),
  assistantReply: Annotation<string>(),
});

export type AssistantGraphState = typeof AssistantState.State;
