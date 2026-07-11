import { inject, injectable } from 'tsyringe';
import { IChangeMemberRole } from '../../interfaces/use-cases/trip/change-member-role.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
@injectable()
export class ChangeMemberRole implements IChangeMemberRole {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { groupId: string; memberId: string }): Promise<void> {
    return await this._tripRepository.changeMemberRole(
      dto.groupId,
      dto.memberId,
    );
  }
}
