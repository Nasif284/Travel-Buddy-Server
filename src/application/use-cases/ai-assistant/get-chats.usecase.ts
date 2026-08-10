import { inject, injectable } from 'tsyringe';
import { IGetAssistantMessagesUseCase } from '../../interfaces/use-cases/ai-assistant/get-chats.interfce';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IAssistantRepository } from '../../interfaces/repositories/ai-assistant.repository';
import { GetChatsResponseDTO } from '../../dtos/ai-assistant/response/get-chata.dto';

@injectable()
export class GetAssistantMessagesUseCase implements IGetAssistantMessagesUseCase {
  constructor(
    @inject(TOKENS.IAssistantRepository)
    private readonly assistantRepository: IAssistantRepository,
  ) {}

  async execute(userId: string): Promise<GetChatsResponseDTO> {
    const chats = await this.assistantRepository.getMessages(userId);
    return {
      chats,
    };
  }
}
