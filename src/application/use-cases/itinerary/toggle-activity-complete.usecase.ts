import { inject, injectable } from 'tsyringe';
import { IToggleActivityCompletionUseCase } from '../../interfaces/use-cases/itenary/toggle-complete.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { ToggleActivityCompletionRequestDTO } from '../../dtos/itenary/request/toggle-complete.dto';

@injectable()
export class ToggleActivityCompletionUseCase implements IToggleActivityCompletionUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,
  ) {}

  async execute(dto: ToggleActivityCompletionRequestDTO): Promise<void> {
    await this._itineraryRepository.toggleActivityCompletion(dto.activityId);
  }
}
