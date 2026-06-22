import { inject, injectable } from 'tsyringe';
import { IGetMatchProfile } from '../../interfaces/use-cases/trip/get-match-profile.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { GetMatchProfileResponseDTO } from '../../dtos/trip/responce/get-match-profile.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetMatchProfile implements IGetMatchProfile {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: {
    matchId: string;
    userId: string;
  }): Promise<GetMatchProfileResponseDTO> {
    const result = await this._tripRepository.getMatchProfile({
      matchId: dto.matchId,
      userId: dto.userId,
    });
    return {
      match: result.match,
      matchedTrip: result.matchedTrip,
      user: {
        ...result.user,
        avatarUrl: await this._storageService.getSignedUrl(
          result.user.avatarUrl!,
        ),
        coverUrl: await this._storageService.getSignedUrl(
          result.user.coverUrl!,
        ),
      },
    };
  }
}
