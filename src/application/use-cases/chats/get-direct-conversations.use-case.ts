import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetDirectConversationsUseCase } from '../../interfaces/use-cases/chats/get-direct-conversations.interface';
import { IChatRepository } from '../../interfaces/repositories/chat.repository';
import { DirectConversationDTO } from '../../dtos/chat/response/get-direct-conversations.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetDirectConversationsUseCase implements IGetDirectConversationsUseCase {
  constructor(
    @inject(TOKENS.IChatRepository)
    private readonly chatRepository: IChatRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(userId: string): Promise<DirectConversationDTO[]> {
    const conversations =
      await this.chatRepository.getDirectConversations(userId);
    for (const c of conversations) {
      c.user.profileImage = await this._storageService.getSignedUrl(
        c.user.profileImage!,
      );
    }
    return conversations;
  }
}
