import { HttpStatus } from '../../../domain/enums/HttpStatusCodes.constants';
import { AppError } from '../../../presentation/Errors/app.error';
import { GetAllUsersRequestDTO } from '../../dtos/user-management/request/get-users.dto';
import { GetAllUserResponseDTO } from '../../dtos/user-management/response/get-users.dto';
import { IBaseUseCase } from '../../interfaces/base-usecase.interface';
import { IUserRepository } from '../../interfaces/repositories/user.reposetory';

export class GetAllUsers implements IBaseUseCase<
  GetAllUsersRequestDTO,
  GetAllUserResponseDTO
> {
  constructor(private readonly _userRepository: IUserRepository) {}
  async execute(dto: GetAllUsersRequestDTO): Promise<GetAllUserResponseDTO> {
    const result = await this._userRepository.getAllUsers(dto);
    if (!result) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'NO_USER_FOUNT',
        'No users found',
      );
    }
    const totalPages = Math.ceil(result.count / dto.limit);
    return {
      success: true,
      message: 'Fetched all users',
      data: {
        users: result.users,
        limit: dto.limit,
        page: dto.page,
        total: result.count,
        totalPages,
      },
    };
  }
}
