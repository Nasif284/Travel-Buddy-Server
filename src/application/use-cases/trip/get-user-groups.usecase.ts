import { inject, injectable } from 'tsyringe';
import { ITripRepository } from '../../interfaces/repositories/trip.repository';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetUserGroups } from '../../interfaces/use-cases/trip/get-user-groups.interface';
import { GetGroupsResponseDTO } from '../../dtos/trip/responce/get-groups.dto';

@injectable()
export class GetUserGroups implements IGetUserGroups {
  constructor(
    @inject(TOKENS.ITripRepository)
    private readonly _tripRepository: ITripRepository,
  ) {}
  async execute(dto: { userId: string }): Promise<GetGroupsResponseDTO> {
    return await this._tripRepository.getUserTripGroups(dto.userId);
  }
}
