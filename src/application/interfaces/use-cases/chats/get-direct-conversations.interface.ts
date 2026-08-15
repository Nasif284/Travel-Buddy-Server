import { DirectConversationDTO } from '../../../dtos/chat/response/get-direct-conversations.dto';

export interface IGetDirectConversationsUseCase {
  execute(userId: string): Promise<DirectConversationDTO[]>;
}
