import { GetAdminsResponseDTO } from '../../../dtos/admins/response/get-admins.dto';

export interface IGetAdmins {
  execute(): Promise<GetAdminsResponseDTO>;
}
