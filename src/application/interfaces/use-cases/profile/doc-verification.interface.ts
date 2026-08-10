import { SubmitVerificationRequestDTO } from '../../../dtos/profile/request/doc-verification.dto';
import { SubmitVerificationResponseDTO } from '../../../dtos/profile/response/doc-verification.dto';

export interface ISubmitVerificationUseCase {
  execute(
    dto: SubmitVerificationRequestDTO,
  ): Promise<SubmitVerificationResponseDTO>;
}
