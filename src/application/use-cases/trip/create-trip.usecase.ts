import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { ICreateTrip } from '../../interfaces/use-cases/trip/create-trip.usecase';
import { CreateTripRequestDTO } from '../../dtos/trip/request/create-trip.dto';
import { IImageService } from '../../interfaces/services/image.service.interace';
import { generateInviteCode } from '../../../shared/helpers/generateUniqueCode';
import { ICalculateMatch } from '../../interfaces/use-cases/trip/calculate-match.interface';
import logger from '../../../infrastructure/logging/logger';

@injectable()
export class CreateTrip implements ICreateTrip {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
    @inject(TOKENS.IImageService) private readonly _imageService: IImageService,
    @inject(TOKENS.ICalculateMatch)
    private readonly _calculateMatch: ICalculateMatch,
  ) {}

  async execute(dto: CreateTripRequestDTO): Promise<void> {
    if (dto.dateFrom >= dto.dateTo) {
      throw new Error('End date must be after start date');
    }

    let destination = await this._tripRepository.findDestinationByPlaceId(
      dto.placeId,
    );

    if (!destination) {
      const coverUrl = await this._imageService.getDestinationCover(
        dto.destinationName,
      );

      destination = await this._tripRepository.createDestination({
        placeId: dto.placeId,
        name: dto.destinationName,
        city: dto.city,
        state: dto.state,
        countryCode: dto.countryCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        coverUrl: coverUrl ?? null,
      });
    }
    const { tripId } = await this._tripRepository.createTrip({
      name: dto.name,
      destinationId: destination.id,
      dateFrom: dto.dateFrom,
      dateTo: dto.dateTo,
      budgetStyle: dto.budgetStyle,
      travelStyleCode: dto.travelStyleCode,
      preferredMembers: dto.preferredMembers,
      createdBy: dto.userId,
      inviteCode: await generateInviteCode(),
    });
    setImmediate(() => {
      this._calculateMatch.execute({ tripId }).catch(logger.error);
    });
  }
}
