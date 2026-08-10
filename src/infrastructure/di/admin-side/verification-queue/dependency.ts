import { container } from 'tsyringe';
import { GetVerificationQueueUseCase } from '../../../../application/use-cases/verifications/get-verifications-queue.usecse';
import { TOKENS } from '../../tokens';
import { GetVerificationDetailsUseCase } from '../../../../application/use-cases/verifications/get-verification-detail.usecase';
import { IApproveVerification } from '../../../../application/interfaces/use-cases/verifications/approve-verification.interface';
import { ApproveVerification } from '../../../../application/use-cases/verifications/approve-verificaitn.usecase';
import { IRejectVerification } from '../../../../application/interfaces/use-cases/verifications/reject-verification.interface';
import { RejectVerification } from '../../../../application/use-cases/verifications/reject-verification.usecase';
import { IRequestVerificationResubmission } from '../../../../application/interfaces/use-cases/verifications/request-resubmission.interface';
import { RequestVerificationResubmission } from '../../../../application/use-cases/verifications/request-resubmission.usecase';

export function registerVerificationDependency() {
  container.registerSingleton<GetVerificationQueueUseCase>(
    TOKENS.IGetVerificationQueue,
    GetVerificationQueueUseCase,
  );
  container.registerSingleton<GetVerificationDetailsUseCase>(
    TOKENS.IGetVerificationDetailsUseCase,
    GetVerificationDetailsUseCase,
  );
  container.registerSingleton<IApproveVerification>(
    TOKENS.IApproveVerification,
    ApproveVerification,
  );
  container.registerSingleton<IRejectVerification>(
    TOKENS.IRejectVerification,
    RejectVerification,
  );
  container.registerSingleton<IRequestVerificationResubmission>(
    TOKENS.IRequestVerificationResubmission,
    RequestVerificationResubmission,
  );
}
