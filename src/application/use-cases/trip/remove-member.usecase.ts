import { inject, injectable } from 'tsyringe';
import { IRemoveMember } from '../../interfaces/use-cases/trip/remove-member.inteface';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
@injectable()
export class RemoveMember implements IRemoveMember {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: {
    groupId: string;
    memberId: string;
    userId: string;
  }): Promise<void> {
    return await this._tripRepository.removeFromGroup(
      dto.groupId,
      dto.memberId,
    );
  }
}
