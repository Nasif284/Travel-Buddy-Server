import { UploadChatImageResponseDTO } from '../../../dtos/chat/request/upload-chat-image.dto';

export interface IUploadChatImageUseCase {
  execute(
    userId: string,
    conversationId: string,
    file: Express.Multer.File,
  ): Promise<UploadChatImageResponseDTO>;
}
