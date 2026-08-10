import { GetVerificationQueueRequestDTO } from '../../../dtos/verifications/request/get-verification-queue.dto';
import { GetVerificationQueueResponseDTO } from '../../../dtos/verifications/response/get-verification-queue.dto';

export interface IGetVerificationQueue {
  execute(
    dto: GetVerificationQueueRequestDTO,
  ): Promise<GetVerificationQueueResponseDTO>;
}
