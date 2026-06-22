import { GetSettingsResponseDTO } from '../../../dtos/profile/response/get-settings.dto';

export interface IGetSettings {
  execute(dot: { userId: string }): Promise<GetSettingsResponseDTO>;
}
