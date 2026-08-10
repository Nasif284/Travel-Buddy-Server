import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetAllTripGroups } from '../../../../application/interfaces/use-cases/trip/get-all-groups.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { TRIP_MESSAGES } from '../../../../shared/constants/messages/success/trip/trip.messages';
import { GetGroupsRequestDTO } from '../../../../application/dtos/trip/request/get-all-groups.dto';
import { IGetGroup } from '../../../../application/interfaces/use-cases/trip/get-group.interface';
@injectable()
export class TripManagementController {
  constructor(
    @inject(TOKENS.IGetAllTripGroups)
    private readonly _getAllTripGroups: IGetAllTripGroups,
    @inject(TOKENS.IGetGroup)
    private readonly _getGroup: IGetGroup,
  ) {}
  getAllTripGroups = async (req: Request, res: Response): Promise<Response> => {
    const payload: GetGroupsRequestDTO = {
      page: parseInt(req.query.page as string),
      limit: parseInt(req.query.limit as string),
      tripStatus: req.query.tripStatus as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'desc' | 'asc',
      budgetStyle: req.query.budgetStyle as string,
    };

    const data = await this._getAllTripGroups.execute(payload);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_ACTIVE_GROUPS, data));
  };
  getGroup = async (req: Request, res: Response): Promise<Response> => {
    const groupId = req.params.id;
    const data = await this._getGroup.execute({ groupId: groupId as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.GET_GROUP, data));
  };
}
