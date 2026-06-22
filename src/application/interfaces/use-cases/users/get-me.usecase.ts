import { GetUserProfileResponseDTO } from '../../../dtos/users/response/user-profile.dto';

export interface IGetMe {
  execute(dto: { userId: string }): Promise<GetUserProfileResponseDTO>;
}
