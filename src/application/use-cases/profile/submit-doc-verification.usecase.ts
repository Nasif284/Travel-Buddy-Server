import { inject, injectable } from 'tsyringe';
import { SubmitVerificationRequestDTO } from '../../dtos/profile/request/doc-verification.dto';
import { SubmitVerificationResponseDTO } from '../../dtos/profile/response/doc-verification.dto';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { ISubmitVerificationUseCase } from '../../interfaces/use-cases/profile/doc-verification.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IVerificationQueueService } from '../../interfaces/services/verification-queue.service.interface';

@injectable()
export class SubmitVerificationUseCase implements ISubmitVerificationUseCase {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,

    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,

    @inject(TOKENS.IVerificationQueueService)
    private readonly _verificationQueueService: IVerificationQueueService,
  ) {}

  async execute(
    dto: SubmitVerificationRequestDTO,
  ): Promise<SubmitVerificationResponseDTO> {
    const uploadedKeys: string[] = [];
    try {
      const existing =
        await this._verificationRepository.getVerificationDocuments(dto.userId);

      if (existing) {
        await Promise.all(
          existing.map((document) =>
            this._storageService.delete(document.storageKey),
          ),
        );
      }

      const documents = [];
      for (const file of dto.uploadedDocuments) {
        const extension = this.getExtensionFromMime(file.mimeType);
        const storageKey = `verification-documents/${crypto.randomUUID()}/${file.sideCode}${extension}`;

        await this._storageService.upload(
          file.buffer,
          storageKey,
          file.mimeType,
        );

        uploadedKeys.push(storageKey);

        documents.push({
          sideCode: file.sideCode,
          storageKey,
          mimeType: file.mimeType,
          fileSize: file.size,
        });
      }

      const verification =
        await this._verificationRepository.submitVerification({
          userId: dto.userId,
          documentTypeCode: dto.documentTypeCode,
          documents,
        });

      await this._verificationQueueService.enqueue(verification.id);

      return {
        verificationId: verification.id,
      };
    } catch (error) {
      await Promise.all(
        uploadedKeys.map((key) => this._storageService.delete(key)),
      );

      throw error;
    }
  }

  private getExtensionFromMime(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';

      case 'image/png':
        return '.png';

      case 'application/pdf':
        return '.pdf';

      default:
        return '';
    }
  }
}
