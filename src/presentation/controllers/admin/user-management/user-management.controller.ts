import { Request, Response } from 'express';
import { GetAllUsers } from '../../../../application/use-cases/user-management/get-users.usecase';
import { GetAllUsersRequestDTO } from '../../../../application/dtos/user-management/request/get-users.dto';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { USER_MANAGEMENT_MESSAGES } from '../../../../shared/constants/messages/success/user-management';
import { injectable } from 'tsyringe';
import { ChangeUserStatus } from '../../../../application/use-cases/user-management/change-user-status.usecase';
@injectable()
export class UserManagementController {
  constructor(
    private readonly _getAllUsersUseCase: GetAllUsers,
    private readonly _changeUserStatusUseCase: ChangeUserStatus,
  ) {}
  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const payload: GetAllUsersRequestDTO = {
      page: parseInt(req.query.page as string),
      limit: parseInt(req.query.limit as string),
      filter: {
        status: req.query.status as string,
        joined: req.query.joined as string,
        verified: req.query.verified as string,
        search: req.query.search as string,
      },
      orderBy: req.query.orderBy as string,
    };
    const result = await this._getAllUsersUseCase.execute(payload);
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.success(USER_MANAGEMENT_MESSAGES.GET_ALL_USERS, result),
      );
  };
  changeUserStatus = async (req: Request, res: Response): Promise<Response> => {
    await this._changeUserStatusUseCase.execute(req.body);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(USER_MANAGEMENT_MESSAGES.USER_STATUS_CHANGE));
  };
}
