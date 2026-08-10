import { GetVerificationDetailsRequestDTO } from '../../../dtos/verifications/request/get-verification-details.dto';
import { GetVerificationDetailsResponseDTO } from '../../../dtos/verifications/response/get-verification-details.dto';
export interface IGetVerificationDetailsUseCase {
  execute(
    dto: GetVerificationDetailsRequestDTO,
  ): Promise<GetVerificationDetailsResponseDTO>;
}
