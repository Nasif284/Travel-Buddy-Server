import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../di/tokens';
import { IAssistantRepository } from '../../../../application/interfaces/repositories/ai-assistant.repository';
import { IUserRepository } from '../../../../application/interfaces/repositories/user.reposetory';
import { ITripRepository } from '../../../../application/interfaces/repositories/trip.repository';
import { AssistantContext } from '../../../../application/interfaces/use-cases/ai-assistant/chat.interface';
@injectable()
export class AssistantContextBuilder {
  constructor(
    @inject(TOKENS.IAssistantRepository)
    private readonly _assistantRepository: IAssistantRepository,
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}

  async build(userId: string): Promise<AssistantContext> {
    const conversationId =
      await this._assistantRepository.getOrCreateConversation(userId);

    const recentMessages = await this._assistantRepository.getRecentMessages(
      conversationId,
      10,
    );

    const user = await this._userRepository.findUserById(userId);
    const activeTrip = await this._tripRepository.getActiveTrip({ userId });

    return {
      conversationId,
      user: {
        firstName: user!.fullName,
        id: user!.id,
      },
      activeTrip: activeTrip
        ? {
            destination: activeTrip.destination.name,
            startDate: activeTrip.dateFrom.toDateString(),
            endDate: activeTrip.dateTo.toDateString(),
            budgetStyle: activeTrip.budgetStyleCode,
            travelStyle: activeTrip.travelStyleCode,
          }
        : null,
      recentMessages,
    };
  }
}
