import { GetChatsResponseDTO } from '../../../dtos/ai-assistant/response/get-chata.dto';

export interface IGetAssistantMessagesUseCase {
  execute(userId: string): Promise<GetChatsResponseDTO>;
}
