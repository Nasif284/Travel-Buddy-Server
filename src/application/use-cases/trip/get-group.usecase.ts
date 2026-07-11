import { inject, injectable } from 'tsyringe';
import { IGetGroup } from '../../interfaces/use-cases/trip/get-group.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GroupData } from '../../dtos/trip/responce/get-groups.dto';
@injectable()
export class GetGroup implements IGetGroup {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { groupId: string }): Promise<GroupData> {
    return await this._tripRepository.GetGroupWithDetails(dto.groupId);
  }
}
