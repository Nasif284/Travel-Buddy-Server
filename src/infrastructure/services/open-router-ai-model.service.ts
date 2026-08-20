import { injectable } from 'tsyringe';
import { OpenRouter } from '@openrouter/sdk';
import {
  AICompletionRequest,
  AICompletionResponse,
  IAIModelService,
} from '../../application/interfaces/services/ai-model.service.interface';

@injectable()
export class OpenRouterAIModelService implements IAIModelService {
  private readonly client: OpenRouter;

  constructor() {
    this.client = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      httpReferer: process.env.APP_URL,
      appTitle: process.env.APP_NAME,
    });
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    try {
      const completion = await this.client.chat.send({
        chatRequest: {
          model:
            request.model ??
            process.env.OPENROUTER_MODEL ??
            'google/gemini-2.5-flash',
          messages: request.messages,
          temperature: request.options?.temperature ?? 0.3,
          maxTokens: request.options?.maxTokens ?? 2048,
          stream: false,
        },
      });
      let content;
      let model: string | undefined;
      let usage: any | undefined;

      if ('choices' in completion) {
        content = completion.choices?.[0]?.message?.content;
        model = completion.model;
        usage = completion.usage;

        if (!content) {
          throw new Error('Model returned empty response.');
        }
      }

      return {
        text: content as string,
        model: model!,
        usage: usage
          ? {
              promptTokens: usage.prompt_tokens,
              completionTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      console.error('OpenRouter Error:', error);
      const err = new Error('Failed to generate AI response.');
      (err as any).cause = error;
      throw err;
    }
  }
}
