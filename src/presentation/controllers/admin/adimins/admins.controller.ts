import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetAdmins } from '../../../../application/interfaces/use-cases/admins/get-admins.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { ADMIN_MESSAGES } from '../../../../shared/constants/messages/success/admin/admin.messages';

@injectable()
export class AdminsController {
  constructor(
    @inject(TOKENS.IGetAdmins) private readonly _getAdmins: IGetAdmins,
  ) {}
  getAdmins = async (req: Request, res: Response): Promise<Response> => {
    const data = await this._getAdmins.execute();
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.FETCHED_ADMINS, data));
  };
}
