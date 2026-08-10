import { ApproveVerificationRequestDTO } from '../../../dtos/verifications/request/approve-request.dto';

export interface IApproveVerification {
  execute(dto: ApproveVerificationRequestDTO): Promise<void>;
}
