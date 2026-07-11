import { inject, injectable } from 'tsyringe';
import { IGetInvites } from '../../interfaces/use-cases/trip/get-invites.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GetGroupInvitesResponse } from '../../dtos/trip/responce/get-invites.dto';
@injectable()
export class GetInvites implements IGetInvites {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { groupId: string }): Promise<GetGroupInvitesResponse> {
    return await this._tripRepository.getGroupInvites(dto.groupId);
  }
}
