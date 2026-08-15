import { inject, injectable } from 'tsyringe';

import {
  ChatMessageDTO,
  IChatRepository,
} from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ISendChatMessageUseCase } from '../../interfaces/use-cases/chats/send-message.interface';
import { IJoinChatConversationValidationUseCase } from '../../interfaces/use-cases/chats/join-conversation-validation.interface';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class SendChatMessageUseCase implements ISendChatMessageUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
    @inject(TOKENS.IJoinChatConversationValidationUseCase)
    private readonly _validate: IJoinChatConversationValidationUseCase,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    conversationId: string,
    content: string,
  ): Promise<ChatMessageDTO> {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      throw new Error('Message cannot be empty.');
    }

    await this._validate.execute(userId, conversationId);

    const message = await this.chatRepository.saveMessage(
      conversationId,
      userId,
      trimmedContent,
    );

    message.sender!.avatarUrl = await this._storageService.getSignedUrl(
      message.sender!.avatarUrl!,
    );
    return message;
  }
}
