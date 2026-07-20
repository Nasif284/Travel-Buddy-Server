import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetAllTripGroups } from '../../../../application/interfaces/use-cases/trip/get-all-groups.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { TRIP_MESSAGES } from '../../../../shared/constants/messages/success/trip/trip.messages';
@injectable()
export class TripManagementController {
  constructor(
    @inject(TOKENS.IGetAllTripGroups)
    private readonly _getAllTripGroups: IGetAllTripGroups,
  ) {}
  getAllTripGroups = async (req: Request, res: Response): Promise<Response> => {
    const data = await this._getAllTripGroups.execute();
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(TRIP_MESSAGES.FETCHED_ACTIVE_GROUPS, data));
  };
}
