import { injectable } from 'tsyringe';
import { IVerificationQueueService } from '../../application/interfaces/services/verification-queue.service.interface';
import { verificationQueue } from '../jobs/queues/verification.queue';

@injectable()
export class BullMQVerificationQueueService implements IVerificationQueueService {
  async enqueue(verificationId: string): Promise<void> {
    const job = {
      verificationId,
    };
    await verificationQueue.add('process-verification', job);
  }
}
