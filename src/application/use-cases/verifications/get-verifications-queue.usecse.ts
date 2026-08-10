import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetVerificationQueue } from '../../interfaces/use-cases/verifications/get-verification-queue.interface';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import {
  GetVerificationQueueRequestDTO,
  VerificationQueueTab,
} from '../../dtos/verifications/request/get-verification-queue.dto';
import { GetVerificationQueueResponseDTO } from '../../dtos/verifications/response/get-verification-queue.dto';
import { VerificationStatus } from '../../../domain/enums/verification.constants';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetVerificationQueueUseCase implements IGetVerificationQueue {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(
    dto: GetVerificationQueueRequestDTO,
  ): Promise<GetVerificationQueueResponseDTO> {
    const { items, total } =
      await this._verificationRepository.getVerificationQueue(dto);
    for (const i of items) {
      i.user.profilePicture = await this._storageService.getSignedUrl(
        i.user.profilePicture!,
      );
    }

    return {
      items,
      pagination: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }
}
