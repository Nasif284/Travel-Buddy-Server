import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetAdmins } from '../../../../application/interfaces/use-cases/admins/get-admins.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { ADMIN_MESSAGES } from '../../../../shared/constants/messages/success/admin/admin.messages';
import { IUpdateAdmin } from '../../../../application/interfaces/use-cases/admins/update-admin.interface';

@injectable()
export class AdminsController {
  constructor(
    @inject(TOKENS.IGetAdmins) private readonly _getAdmins: IGetAdmins,
    @inject(TOKENS.IUpdateAdmin) private readonly _updateAdmin: IUpdateAdmin,
  ) {}
  getAdmins = async (req: Request, res: Response): Promise<Response> => {
    const data = await this._getAdmins.execute();
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.FETCHED_ADMINS, data));
  };
  updateAdmin = async (req: Request, res: Response): Promise<Response> => {
    const adminId = req.params.adminId;
    const actionedBy = req.user?.userId;
    const data = req.body;

    const result = await this._updateAdmin.execute({
      adminId,
      actionedBy,
      ...data,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(ADMIN_MESSAGES.UPDATED, result));
  };
}
