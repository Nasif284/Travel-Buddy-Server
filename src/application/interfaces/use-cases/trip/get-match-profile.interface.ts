import { GetMatchProfileResponseDTO } from '../../../dtos/trip/responce/get-match-profile.dto';

export interface IGetMatchProfile {
  execute(dto: {
    matchId: string;
    userId: string;
  }): Promise<GetMatchProfileResponseDTO>;
}
