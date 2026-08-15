import { inject, injectable } from 'tsyringe';

import { IChatRepository } from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetDirectChatUseCase } from '../../interfaces/use-cases/chats/get-direct-chat.interface';

@injectable()
export class GetDirectChatUseCase implements IGetDirectChatUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(userId: string, otherUserId: string): Promise<string> {
    if (userId === otherUserId) {
      throw new Error('You cannot start a chat with yourself.');
    }

    const existing = await this.chatRepository.findDirectConversation(
      userId,
      otherUserId,
    );

    if (existing) {
      return existing;
    }

    return this.chatRepository.createDirectConversation(userId, otherUserId);
  }
}
