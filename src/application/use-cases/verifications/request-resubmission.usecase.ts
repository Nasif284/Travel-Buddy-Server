import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IRequestVerificationResubmission } from '../../interfaces/use-cases/verifications/request-resubmission.interface';
import { RequestVerificationResubmissionRequestDTO } from '../../dtos/verifications/request/request-resubmission.dto';

@injectable()
export class RequestVerificationResubmission implements IRequestVerificationResubmission {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly verificationRepository: IVerificationRepository,
  ) {}

  async execute(dto: RequestVerificationResubmissionRequestDTO): Promise<void> {
    await this.verificationRepository.updateVerificationReview(
      dto.verificationId,
      {
        statusCode: 'resubmission_requested',
        reviewerId: dto.reviewerId,
        rejectionReason: null,
        resubmissionReason: dto.resubmissionReason,
        activityCode: 'resubmission_requested',
        reviewedAt: new Date(),
      },
    );
  }
}
