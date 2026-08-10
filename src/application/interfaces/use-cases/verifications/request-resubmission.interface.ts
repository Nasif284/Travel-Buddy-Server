import { RequestVerificationResubmissionRequestDTO } from '../../../dtos/verifications/request/request-resubmission.dto';

export interface IRequestVerificationResubmission {
  execute(dto: RequestVerificationResubmissionRequestDTO): Promise<void>;
}
