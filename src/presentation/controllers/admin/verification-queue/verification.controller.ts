import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { IGetVerificationQueue } from '../../../../application/interfaces/use-cases/verifications/get-verification-queue.interface';
import {
  GetVerificationQueueRequestDTO,
  VerificationQueueTab,
} from '../../../../application/dtos/verifications/request/get-verification-queue.dto';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { VERIFICATION_MESSAGES } from '../../../../shared/constants/messages/success/admin/verification.messages';
import { IGetVerificationDetailsUseCase } from '../../../../application/interfaces/use-cases/verifications/get-verification-details.interface';
import { GetVerificationDetailsRequestDTO } from '../../../../application/dtos/verifications/request/get-verification-details.dto';
import { IApproveVerification } from '../../../../application/interfaces/use-cases/verifications/approve-verification.interface';
import { IRejectVerification } from '../../../../application/interfaces/use-cases/verifications/reject-verification.interface';
import { IRequestVerificationResubmission } from '../../../../application/interfaces/use-cases/verifications/request-resubmission.interface';
@injectable()
export class VerificationQueueController {
  constructor(
    @inject(TOKENS.IGetVerificationQueue)
    private readonly _getVerificationQueue: IGetVerificationQueue,
    @inject(TOKENS.IGetVerificationDetailsUseCase)
    private readonly _getVerificationDetails: IGetVerificationDetailsUseCase,
    @inject(TOKENS.IApproveVerification)
    private readonly _approveVerification: IApproveVerification,
    @inject(TOKENS.IRejectVerification)
    private readonly _rejectVerification: IRejectVerification,
    @inject(TOKENS.IRequestVerificationResubmission)
    private readonly _requestResubmission: IRequestVerificationResubmission,
  ) {}
  getVerificationQueue = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const dto: GetVerificationQueueRequestDTO = {
      tab: req.query.tab as VerificationQueueTab,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 20),
      search: req.query.search?.toString(),
    };
    const result = await this._getVerificationQueue.execute(dto);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(VERIFICATION_MESSAGES.GET_QUEUE, result));
  };

  getVerificationDetails = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const dto: GetVerificationDetailsRequestDTO = {
      verificationId: req.params.verificationId as string,
    };
    const result = await this._getVerificationDetails.execute(dto);
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(VERIFICATION_MESSAGES.GET_DETAILS, result));
  };
  approveVerification = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    await this._approveVerification.execute({
      verificationId: req.params.id as string,
      reviewerId: userId!,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(VERIFICATION_MESSAGES.APPROVE_VERIFICATION));
  };
  rejectVerification = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    await this._rejectVerification.execute({
      verificationId: req.params.id as string,
      reviewerId: userId!,
      rejectionReason: req.body.rejectionReason,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(VERIFICATION_MESSAGES.REJECT_VERIFICATION));
  };
  requestResubmission = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const userId = req.user?.userId;
    await this._requestResubmission.execute({
      verificationId: req.params.id as string,
      reviewerId: userId!,
      resubmissionReason: req.body.resubmissionReason,
    });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(VERIFICATION_MESSAGES.REQUEST_RESUBMISSION));
  };
}
