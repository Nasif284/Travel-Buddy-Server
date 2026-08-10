import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IRejectVerification } from '../../interfaces/use-cases/verifications/reject-verification.interface';
import { RejectVerificationRequestDTO } from '../../dtos/verifications/request/reject-reuquest.dto';

@injectable()
export class RejectVerification implements IRejectVerification {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly verificationRepository: IVerificationRepository,
  ) {}

  async execute(dto: RejectVerificationRequestDTO): Promise<void> {
    await this.verificationRepository.updateVerificationReview(
      dto.verificationId,
      {
        statusCode: 'rejected',
        reviewerId: dto.reviewerId,
        rejectionReason: dto.rejectionReason,
        resubmissionReason: null,
        activityCode: 'rejected',
        reviewedAt: new Date(),
      },
    );
  }
}
