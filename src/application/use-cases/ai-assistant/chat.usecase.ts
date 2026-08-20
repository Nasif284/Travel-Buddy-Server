import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import {
  IAssistantContextBuilder,
  IChatAssistantUseCase,
} from '../../interfaces/use-cases/ai-assistant/chat.interface';

import { ChatRequestDTO } from '../../dtos/ai-assistant/request/chat.dto';

import { IAssistantRepository } from '../../interfaces/repositories/ai-assistant.repository';

import { ChatResponseDTO } from '../../dtos/ai-assistant/response/chat.dto';
import { IAssistantService } from '../../interfaces/services/ai-assistant.service.interface';
import { IEmbeddingService } from '../../interfaces/services/embedding.service.interface';

@injectable()
export class ChatAssistantUseCase implements IChatAssistantUseCase {
  constructor(
    @inject(TOKENS.IAssistantContextBuilder)
    private readonly contextBuilder: IAssistantContextBuilder,

    @inject(TOKENS.IAssistantService)
    private readonly assistantService: IAssistantService,

    @inject(TOKENS.IAssistantRepository)
    private readonly assistantRepository: IAssistantRepository,

    @inject(TOKENS.IEmbeddingService)
    private readonly embeddingService: IEmbeddingService,
  ) {}

  async execute(dto: ChatRequestDTO): Promise<ChatResponseDTO> {
    const context = await this.contextBuilder.build(dto.userId, dto.message);

    const reply = await this.assistantService.chat(context, dto.message);
    const savedMessages = await this.assistantRepository.saveMessages(
      context.conversationId,
      [
        {
          role: 'user',
          content: dto.message,
        },
        {
          role: 'assistant',
          content: reply,
        },
      ],
    );
    for (const message of savedMessages) {
      const embedding = await this.embeddingService.embed(message.content);

      await this.assistantRepository.saveMessageEmbedding(
        message.id,
        context.conversationId,
        message.content,
        embedding,
      );
    }
    return {
      message: reply,
    };
  }
}
