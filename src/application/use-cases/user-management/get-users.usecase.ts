import { inject, injectable } from 'tsyringe';
import { GetAllUsersRequestDTO } from '../../dtos/user-management/request/get-users.dto';
import { GetAllUserResponseDTO } from '../../dtos/user-management/response/get-users.dto';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';
import { IGetUsers } from '../../interfaces/use-cases/user-management/get-users.interface';
import { UserNotFoundError } from '../../../domain/errors/auth.error';
import { TOKENS } from '../../../infrastructure/di/tokens';
@injectable()
export class GetAllUsers implements IGetUsers {
  constructor(
    @inject(TOKENS.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}
  async execute(dto: GetAllUsersRequestDTO): Promise<GetAllUserResponseDTO> {
    const result = await this._userRepository.getAllUsers(dto);
    if (!result) {
      throw new UserNotFoundError();
    }
    const totalPages = Math.ceil(result.count / dto.limit);
    return {
      users: result.users,
      limit: dto.limit,
      page: dto.page,
      total: result.count,
      totalPages,
    };
  }
}
