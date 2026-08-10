import { RejectVerificationRequestDTO } from '../../../dtos/verifications/request/reject-reuquest.dto';

export interface IRejectVerification {
  execute(dto: RejectVerificationRequestDTO): Promise<void>;
}
