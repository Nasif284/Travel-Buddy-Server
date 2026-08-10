import { Job } from 'bullmq';
import { container } from 'tsyringe';
import { ProcessVerificationUseCase } from '../../../application/use-cases/verifications/verification-processing.usecase';

export async function processVerificationProcessor(
  job: Job<{ verificationId: string }>,
): Promise<void> {
  const useCase = container.resolve(ProcessVerificationUseCase);

  await useCase.execute({
    verificationId: job.data.verificationId,
  });
}
