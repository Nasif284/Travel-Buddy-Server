import { inject, injectable } from 'tsyringe';

import { IChatRepository } from '../../interfaces/repositories/chat.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetGroupChatUseCase } from '../../interfaces/use-cases/chats/get-group-chat.interface';

@injectable()
export class GetGroupChatUseCase implements IGetGroupChatUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(userId: string, groupId: string): Promise<string> {
    const conversation =
      await this.chatRepository.getOrCreateGroupConversation(groupId);

    const isMember = await this.chatRepository.isGroupConversationMember(
      conversation,
      userId,
    );

    if (!isMember) {
      throw new Error('You are not a member of this trip group.');
    }

    return conversation;
  }
}
