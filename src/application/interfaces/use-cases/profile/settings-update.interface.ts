import { UpdateSettingsRequestDTO } from '../../../dtos/profile/request/settings-update.dto';

export interface IUpdateSettings {
  execute(dto: {
    userId: string;
    payload: UpdateSettingsRequestDTO;
  }): Promise<void>;
}
