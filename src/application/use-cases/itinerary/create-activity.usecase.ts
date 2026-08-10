import { inject, injectable } from 'tsyringe';
import { ICreateItineraryActivityUseCase } from '../../interfaces/use-cases/itenary/careate-activity.interface';
import { IItineraryRepository } from '../../interfaces/repositories/itenary.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { CreateItineraryActivityRequestDTO } from '../../dtos/itenary/request/create-activity.dto';

@injectable()
export class CreateItineraryActivityUseCase implements ICreateItineraryActivityUseCase {
  constructor(
    @inject(TOKENS.IItineraryRepository)
    private readonly _itineraryRepository: IItineraryRepository,
  ) {}

  async execute(dto: CreateItineraryActivityRequestDTO): Promise<void> {
    await this._itineraryRepository.createItineraryActivity(dto);
  }
}
