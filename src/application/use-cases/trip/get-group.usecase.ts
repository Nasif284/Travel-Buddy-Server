import { inject, injectable } from 'tsyringe';
import { IGetGroup } from '../../interfaces/use-cases/trip/get-group.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GroupData } from '../../dtos/trip/responce/get-groups.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetGroup implements IGetGroup {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { groupId: string }): Promise<GroupData> {
    const group = await this._tripRepository.GetGroupWithDetails(dto.groupId);
    for (const m of group.members) {
      m.avatarUrl = await this._storageService.getSignedUrl(m.avatarUrl!);
    }
    return group;
  }
}
