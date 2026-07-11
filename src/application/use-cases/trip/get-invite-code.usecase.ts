import { inject, injectable } from 'tsyringe';
import { IGetInviteCode } from '../../interfaces/use-cases/trip/get-invite-code.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
@injectable()
export class GetInviteCode implements IGetInviteCode {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { groupId: string }): Promise<{ inviteCode: string }> {
    return await this._tripRepository.getInviteCode(dto.groupId);
  }
}
