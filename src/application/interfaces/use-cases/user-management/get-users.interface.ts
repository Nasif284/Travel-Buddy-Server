import { GetAllUsersRequestDTO } from '../../../dtos/user-management/request/get-users.dto';
import { GetAllUserResponseDTO } from '../../../dtos/user-management/response/get-users.dto';

export interface IGetUsers {
  execute(dto: GetAllUsersRequestDTO): Promise<GetAllUserResponseDTO>;
}
