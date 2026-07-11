import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { IJoinWithLink } from '../../interfaces/use-cases/trip/join-with-link.interface';

@injectable()
export class JoinWithLink implements IJoinWithLink {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}

  async execute(dto: {
    inviteCode: string;
    userId: string;
  }): Promise<{ groupId: string }> {
    return await this._tripRepository.joinGroupByInviteCode(dto);
  }
}
