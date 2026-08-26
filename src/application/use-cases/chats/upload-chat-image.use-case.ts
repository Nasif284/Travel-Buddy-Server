import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IChatRepository } from '../../interfaces/repositories/chat.repository';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { IJoinChatConversationValidationUseCase } from '../../interfaces/use-cases/chats/join-conversation-validation.interface';

import crypto from 'crypto';
import { UploadChatImageResponseDTO } from '../../dtos/chat/request/upload-chat-image.dto';
import { IUploadChatImageUseCase } from '../../interfaces/use-cases/chats/upload-chat-image.interface';

@injectable()
export class UploadChatImageUseCase implements IUploadChatImageUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,

    @inject(TOKENS.IJoinChatConversationValidationUseCase)
    private readonly validateConversation: IJoinChatConversationValidationUseCase,

    @inject(TOKENS.IStorageService)
    private readonly storageService: IStorageService,
  ) {}

  async execute(
    userId: string,
    conversationId: string,
    file: Express.Multer.File,
  ): Promise<UploadChatImageResponseDTO> {
    await this.validateConversation.execute(userId, conversationId);

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Only JPEG, PNG, WEBP and GIF images are allowed.');
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      throw new Error('Image size cannot exceed 10MB.');
    }

    const extension =
      file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg';

    const storageKey = `chat/${conversationId}/${crypto.randomUUID()}.${extension}`;

    await this.storageService.upload(file.buffer, storageKey, file.mimetype);

    return {
      storageKey,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }
}
