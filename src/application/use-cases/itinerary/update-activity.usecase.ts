import { inject, injectable } from 'tsyringe';
import { IUpdateItineraryActivityUseCase } from '../../interfaces/use-cases/itenary/update-activity.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { UpdateItineraryActivityRequestDTO } from '../../dtos/itenary/request/update-activity.dto';

@injectable()
export class UpdateItineraryActivityUseCase implements IUpdateItineraryActivityUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,
  ) {}

  async execute(dto: UpdateItineraryActivityRequestDTO): Promise<void> {
    await this._itineraryRepository.updateActivity(dto);
  }
}
