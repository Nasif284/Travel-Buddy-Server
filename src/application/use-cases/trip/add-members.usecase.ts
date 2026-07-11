import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { IAddMembers } from '../../interfaces/use-cases/trip/add-members.interface';
@injectable()
export class AddMembers implements IAddMembers {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: {
    members: string[];
    groupId: string;
    addedBy: string;
  }): Promise<void> {
    for (const m of dto.members) {
      await this._tripRepository.addMember(m, dto.groupId, dto.addedBy);
    }
  }
}
