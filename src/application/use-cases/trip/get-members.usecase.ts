import { inject, injectable } from 'tsyringe';
import { IGetMembers } from '../../interfaces/use-cases/trip/get-memeber.usecase';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { GetMembersResponseDTO } from '../../dtos/trip/responce/get-members.dto';
@injectable()
export class GetMembers implements IGetMembers {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(dto: { groupId: string }): Promise<GetMembersResponseDTO> {
    const result = await this._tripRepository.getMembers(dto.groupId);
    for (const m of result.members) {
      m.avatarUrl = await this._storageService.getSignedUrl(m.avatarUrl);
    }
    return { members: result.members };
  }
}
