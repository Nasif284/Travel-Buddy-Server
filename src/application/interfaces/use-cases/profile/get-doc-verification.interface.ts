import { GetDocVerificationResponseDTO } from '../../../dtos/profile/response/get-doc-verification.dto';

export interface IGetDocVerification {
  execute(dto: {
    userId: string;
  }): Promise<GetDocVerificationResponseDTO | null>;
}
