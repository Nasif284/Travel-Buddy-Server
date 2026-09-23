import { inject, injectable } from 'tsyringe';
import { IChatRepository } from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IMarkMessagesAsReadUseCase } from '../../interfaces/use-cases/chats/mark-messages-read.interface';

@injectable()
export class MarkMessagesAsReadUseCase implements IMarkMessagesAsReadUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(
    userId: string,
    conversationId: string,
  ): Promise<{ count: number; readAt: Date }> {
    return this.chatRepository.markMessagesAsRead(conversationId, userId);
  }
}
