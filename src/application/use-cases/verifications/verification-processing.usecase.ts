import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import { IOcrService } from '../../interfaces/services/ocr.service.interface';
import { IDocumentAnalysisService } from '../../interfaces/services/doucment-analysis.service.interface';
import { IDocumentExtractionService } from '../../interfaces/services/document-extraction.service.interface';

@injectable()
export class ProcessVerificationUseCase {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
    @inject(TOKENS.IOcrService)
    private readonly _ocrService: IOcrService,
    @inject(TOKENS.IDocumentExtractionService)
    private readonly _documentExtractionService: IDocumentExtractionService,
    @inject(TOKENS.IDocumentAnalysisService)
    private readonly _documentAnalysisService: IDocumentAnalysisService,
  ) {}

  async execute(dto: { verificationId: string }): Promise<void> {
    const verification =
      await this._verificationRepository.getVerificationForProcessing(
        dto.verificationId,
      );

    if (!verification) {
      throw new Error('Verification not found');
    }
    const files = await Promise.all(
      verification.documents.map(async (document) => ({
        sideCode: document.sideCode,
        mimeType: document.mimeType,
        buffer: await this._storageService.download(document.storageKey),
      })),
    );

    const rawOcr = await this._ocrService.extractDocumentData(files);
    const extraction = await this._documentExtractionService.extract(rawOcr);
    const analysis = await this._documentAnalysisService.analyze({
      extraction,
      documents: files,
    });

    await this._verificationRepository.updateVerificationAfterOcr(
      verification.id,
      {
        extraction,
        analysis,
      },
    );
  }
}
