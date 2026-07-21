import { inject, injectable } from 'tsyringe';
import { IGetActiveGroups } from '../../interfaces/use-cases/trip/get-active-groups.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GetGroupsResponseDTO } from '../../dtos/trip/responce/get-groups.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetActiveGroups implements IGetActiveGroups {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: { userId: string }): Promise<GetGroupsResponseDTO> {
    const groups = await this._tripRepository.getActiveGroups(dto.userId);

    for (const group of groups) {
      for (const member of group.members) {
        if (member.avatarUrl) {
          member.avatarUrl = await this._storageService.getSignedUrl(
            member.avatarUrl,
          );
        }
      }
    }
    return {
      groups,
    };
  }
}
