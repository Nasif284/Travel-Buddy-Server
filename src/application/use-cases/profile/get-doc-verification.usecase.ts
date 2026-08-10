import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';

import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IGetDocVerification } from '../../interfaces/use-cases/profile/get-doc-verification.interface';
import { GetDocVerificationResponseDTO } from '../../dtos/profile/response/get-doc-verification.dto';

@injectable()
export class GetDocVerification implements IGetDocVerification {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,
  ) {}

  async execute(dto: {
    userId: string;
  }): Promise<GetDocVerificationResponseDTO | null> {
    return await this._verificationRepository.getMyVerification(dto.userId);
  }
}
