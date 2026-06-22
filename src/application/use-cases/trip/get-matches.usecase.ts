import { inject, injectable } from 'tsyringe';
import { IGetTripMatches } from '../../interfaces/use-cases/trip/get-trip-matches.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { TripMatchResponseDTO } from '../../dtos/trip/responce/get-matches.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
@injectable()
export class GetTripMatches implements IGetTripMatches {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(dto: {
    tripId: string;
    page: number;
    limit: number;
  }): Promise<TripMatchResponseDTO> {
    const { limit, matches, page, total, totalPages } =
      await this._tripRepository.getTripMatches(
        dto.tripId,
        dto.page,
        dto.limit,
      );
    return {
      matches: await Promise.all(
        matches.map(async (match) => {
          return {
            user: {
              ...match.user,
              avatarUrl: await this._storageService.getSignedUrl(
                match.user.avatarUrl!,
              ),
              coverUrl: await this._storageService.getSignedUrl(
                match.user.coverUrl!,
              ),
            },
            tripMatch: match.tripMatch,
          };
        }),
      ),
      limit,
      page,
      total,
      totalPages,
    };
  }
}
