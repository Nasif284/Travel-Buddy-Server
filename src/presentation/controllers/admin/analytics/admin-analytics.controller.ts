import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../../infrastructure/di/tokens';

import { IAdminAnalyticsUseCase } from '../../../../application/interfaces/use-cases/admin-analytics/admin-analytics.interface';
import { AnalyticsPeriod } from '../../../../application/dtos/admin-analytics/response/admin-analytics.dto';

import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';

@injectable()
export class AdminAnalyticsController {
  constructor(
    @inject(TOKENS.IAdminAnalyticsUseCase)
    private readonly _adminAnalyticsUseCase: IAdminAnalyticsUseCase,
  ) {}

  getAnalytics = async (req: Request, res: Response): Promise<Response> => {
    const period =
      (req.query.period as AnalyticsPeriod) ?? AnalyticsPeriod.TODAY;

    const data = await this._adminAnalyticsUseCase.execute(period);

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success('Admin analytics fetched successfully.', data));
  };
}
