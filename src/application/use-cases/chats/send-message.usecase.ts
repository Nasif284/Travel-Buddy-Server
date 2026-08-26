import { inject, injectable } from 'tsyringe';
import {
  ChatMessageDTO,
  IChatRepository,
} from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ISendChatMessageUseCase } from '../../interfaces/use-cases/chats/send-message.interface';
import { IJoinChatConversationValidationUseCase } from '../../interfaces/use-cases/chats/join-conversation-validation.interface';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { SendChatMessageDTO } from '../../dtos/chat/request/send-message.dto';

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
    dto: SendChatMessageDTO,
  ): Promise<ChatMessageDTO> {
    await this._validate.execute(userId, dto.conversationId);

    if (dto.type === 'TEXT') {
      return this.sendTextMessage(userId, dto);
    }

    if (dto.type === 'IMAGE') {
      return this.sendImageMessage(userId, dto);
    }

    throw new Error('Unsupported message type.');
  }

  private async sendTextMessage(
    userId: string,
    dto: SendChatMessageDTO,
  ): Promise<ChatMessageDTO> {
    const content = dto.content?.trim();

    if (!content) {
      throw new Error('Message cannot be empty.');
    }

    const message = await this.chatRepository.saveMessage(
      dto.conversationId,
      userId,
      {
        type: 'TEXT',
        content,
      },
    );

    return this.addSignedUrls(message);
  }

  private async sendImageMessage(
    userId: string,
    dto: SendChatMessageDTO,
  ): Promise<ChatMessageDTO> {
    if (!dto.attachment) {
      throw new Error('Image attachment is required.');
    }

    const message = await this.chatRepository.saveMessage(
      dto.conversationId,
      userId,
      {
        type: 'IMAGE',
        content: '',
        attachment: dto.attachment,
      },
    );

    return this.addSignedUrls(message);
  }

  private async addSignedUrls(
    message: ChatMessageDTO,
  ): Promise<ChatMessageDTO> {
    if (message.sender?.avatarUrl) {
      message.sender.avatarUrl = await this._storageService.getSignedUrl(
        message.sender.avatarUrl,
      );
    }

    if (message.attachment?.storageKey) {
      message.attachment.url = await this._storageService.getSignedUrl(
        message.attachment.storageKey,
      );
    }

    return message;
  }
}
