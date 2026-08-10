import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IDeleteItineraryActivityUseCase } from '../../interfaces/use-cases/itenary/delete-activity.interface';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { DeleteItineraryActivityRequestDTO } from '../../dtos/itenary/request/delete-activity.dto';

@injectable()
export class DeleteItineraryActivityUseCase implements IDeleteItineraryActivityUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _repository: IItineraryRepository,
  ) {}

  async execute(dto: DeleteItineraryActivityRequestDTO): Promise<void> {
    await this._repository.deleteActivity(dto.activityId);
  }
}
