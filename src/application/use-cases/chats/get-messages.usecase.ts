import { inject, injectable } from 'tsyringe';

import {
  ChatMessageDTO,
  IChatRepository,
} from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetChatMessagesUseCase } from '../../interfaces/use-cases/chats/get-messages.interface';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    conversationId: string,
    limit = 30,
    cursor?: string,
  ): Promise<ChatMessageDTO[]> {
    const conversation =
      await this.chatRepository.getConversation(conversationId);

    if (!conversation) {
      throw new Error('Chat conversation not found.');
    }

    let isMember = false;

    if (conversation.type === 'DIRECT') {
      isMember = await this.chatRepository.isDirectConversationMember(
        conversationId,
        userId,
      );
    }

    if (conversation.type === 'GROUP') {
      isMember = await this.chatRepository.isGroupConversationMember(
        conversationId,
        userId,
      );
    }

    if (!isMember) {
      throw new Error('You are not a member of this conversation.');
    }

    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const messages = await this.chatRepository.getMessages(
      conversationId,
      safeLimit,
      cursor,
    );
    for (const m of messages) {
      m.sender!.avatarUrl = await this._storageService.getSignedUrl(
        m.sender!.avatarUrl!,
      );
    }
    return messages;
  }
}
