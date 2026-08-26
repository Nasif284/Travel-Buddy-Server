import { SendChatMessageDTO } from '../../../dtos/chat/request/send-message.dto';
import { ChatMessageDTO } from '../../repositories/chat.repository';

export interface ISendChatMessageUseCase {
  execute(userId: string, dto: SendChatMessageDTO): Promise<ChatMessageDTO>;
}
