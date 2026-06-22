import { UpdateProfileRequestDTO } from '../../../dtos/profile/request/update-profile.dto';

export interface IUpdateProfile {
  execute(dto: {
    userId: string;
    payload: UpdateProfileRequestDTO;
  }): Promise<void>;
}
