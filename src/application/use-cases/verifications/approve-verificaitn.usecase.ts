import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';

import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IApproveVerification } from '../../interfaces/use-cases/verifications/approve-verification.interface';
import { ApproveVerificationRequestDTO } from '../../dtos/verifications/request/approve-request.dto';

@injectable()
export class ApproveVerification implements IApproveVerification {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,
  ) {}

  async execute(dto: ApproveVerificationRequestDTO): Promise<void> {
    await this._verificationRepository.updateVerificationReview(
      dto.verificationId,

      {
        statusCode: 'approved',
        reviewerId: dto.reviewerId,
        rejectionReason: null,
        resubmissionReason: null,
        activityCode: 'approved',
        reviewedAt: new Date(),
      },
    );
  }
}
