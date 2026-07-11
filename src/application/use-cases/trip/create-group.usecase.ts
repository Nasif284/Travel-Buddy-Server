import { inject, injectable } from 'tsyringe';
import { ICreateGroup } from '../../interfaces/use-cases/trip/create-group.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { generateInviteCode } from '../../../shared/helpers/generateUniqueCode';
@injectable()
export class CreateGroup implements ICreateGroup {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { tripId: string; userId: string }): Promise<void> {
    const inviteCode = generateInviteCode();
    await this._tripRepository.createGroup(dto.tripId, dto.userId, inviteCode);
  }
}
