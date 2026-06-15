import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetUsersForCard } from '../../../../application/interfaces/use-cases/users/get-users-for-card.interface';
import { Request, Response } from 'express';
import { UserNotFoundError } from '../../../../domain/errors/auth.error';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { USER_MESSAGES } from '../../../../shared/constants/messages/success/user/user.messages';
import { IGetNearbyUsers } from '../../../../application/interfaces/use-cases/users/nearby-users.interface';
import { IGetUserProfile } from '../../../../application/interfaces/use-cases/users/get-user-profile.interface';

@injectable()
export class UsersController {
  constructor(
    @inject(TOKENS.IGetUsersForCard)
    private readonly _getUsersForCardUseCase: IGetUsersForCard,
    @inject(TOKENS.IGetNearbyUsers)
    private readonly _getNearbyUsersUseCase: IGetNearbyUsers,
    @inject(TOKENS.IGetUserProfile)
    private readonly _getUserProfileUseCase: IGetUserProfile,
  ) {}

  getUsersForCard = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { page, limit } = req.query;
    if (!userId) {
      throw new UserNotFoundError();
    }
    const data = await this._getUsersForCardUseCase.execute({
      userId,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(USER_MESSAGES.FETCHED_USERS_FOR_CARD, data));
  };
  getNearbyUsers = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?.userId;
    const { page, limit } = req.query;
    if (!userId) {
      throw new UserNotFoundError();
    }
    const data = await this._getNearbyUsersUseCase.execute({
      userId,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(USER_MESSAGES.FETCHED_NEARBY_USERS, data));
  };

  getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    console.log(id);
    const data = await this._getUserProfileUseCase.execute({
      userId: id as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(USER_MESSAGES.FETCHED_USER_PROFILE, data));
  };
}
