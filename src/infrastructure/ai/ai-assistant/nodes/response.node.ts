import { IAIModelService } from '../../../../application/interfaces/services/ai-model.service.interface';
import { buildAssistantPrompt } from '../prompt/assistant.prompt';
import { AssistantGraphState } from '../state';

export async function generateAssistantResponseNode(
  state: AssistantGraphState,
  aiModel: IAIModelService,
) {
  const prompt = buildAssistantPrompt(state.context, state.userMessage);

  const response = await aiModel.complete({
    messages: [
      {
        role: 'system',
        content: prompt.system,
      },
      {
        role: 'user',
        content: prompt.user,
      },
    ],

    options: {
      temperature: 0.6,
      maxTokens: 1000,
    },
  });

  return {
    assistantReply: response.text,
  };
}
