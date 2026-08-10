import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { SaveItineraryRequestDTO } from '../../dtos/itenary/request/save-tinerary.dto';
import { ISaveItineraryUseCase } from './save-tinerary.usecase';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';

@injectable()
export class SaveItineraryUseCase implements ISaveItineraryUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,
  ) {}

  async execute(request: SaveItineraryRequestDTO): Promise<void> {
    await this._itineraryRepository.saveItinerary(
      request.groupId,
      request.userId,
      request.itinerary,
    );
  }
}
