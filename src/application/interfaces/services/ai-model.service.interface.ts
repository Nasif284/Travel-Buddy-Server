import { ZodSchema } from 'zod';

export type AIMessageRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface AICompletionOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface AICompletionRequest {
  model?: string;
  messages: AIMessage[];
  options?: AICompletionOptions;
}
export interface AICompletionResponse {
  text: string;

  model: string;

  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAIModelService {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
  completeStructured<T>(
    request: AICompletionRequest,

    schema: ZodSchema<T>,
  ): Promise<T>;
}
