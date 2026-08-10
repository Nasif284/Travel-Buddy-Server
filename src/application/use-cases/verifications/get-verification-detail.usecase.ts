import { inject, injectable } from 'tsyringe';
import { IGetVerificationDetailsUseCase } from '../../interfaces/use-cases/verifications/get-verification-details.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IVerificationRepository } from '../../interfaces/repositories/verificatiom.repository';
import { IStorageService } from '../../interfaces/services/storage.service.interface';
import {
  GetVerificationDetailsResponseDTO,
  VerificationActivityRepositoryResponse,
  VerificationAiAnalysisDTO,
  VerificationAiCheckDTO,
  VerificationDetailsRepositoryResponse,
  VerificationDocumentItemDTO,
  VerificationDocumentRepositoryResponse,
  VerificationDocumentsDTO,
  VerificationExtractedDataDTO,
  VerificationExtractedDataRepositoryResponse,
  VerificationSummaryDTO,
  VerificationTimelineItemDTO,
  VerificationUserDTO,
} from '../../dtos/verifications/response/get-verification-details.dto';
import { GetVerificationDetailsRequestDTO } from '../../dtos/verifications/request/get-verification-details.dto';

@injectable()
export class GetVerificationDetailsUseCase implements IGetVerificationDetailsUseCase {
  constructor(
    @inject(TOKENS.IVerificationRepository)
    private readonly _verificationRepository: IVerificationRepository,

    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(
    dto: GetVerificationDetailsRequestDTO,
  ): Promise<GetVerificationDetailsResponseDTO> {
    const verification =
      await this._verificationRepository.getVerificationDetails(
        dto.verificationId,
      );
    if (!verification) {
      throw new Error('Verification not found');
    }
    return {
      verificationId: verification.id,
      user: await this.mapUser(verification),
      verification: this.mapVerification(verification),
      documents: await this.mapDocuments(verification.documents),
      aiAnalysis: this.mapAiAnalysis(verification),
      extractedData: this.mapExtractedData(verification.extractedData),
      timeline: this.mapTimeline(verification.activities),
    };
  }
  private async mapUser(
    verification: VerificationDetailsRepositoryResponse,
  ): Promise<VerificationUserDTO> {
    const { user } = verification;
    const now = new Date();

    const accountAgeInDays = Math.floor(
      (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: await this._storageService.getSignedUrl(user.avatarUrl!),
      joinedAt: user.createdAt,
      accountAgeInDays,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      isIdVerified: user.isIdVerified,
      country: user.country?.name ?? null,
    };
  }

  private mapVerification(
    verification: VerificationDetailsRepositoryResponse,
  ): VerificationSummaryDTO {
    return {
      status: {
        code: verification.status.code,
        name: verification.status.name,
      },
      documentType: {
        code: verification.documentType.code,
        name: verification.documentType.name,
      },

      submittedAt: verification.submittedAt,
      reviewStartedAt: verification.reviewStartedAt,
      reviewedAt: verification.reviewedAt,
      reviewer: verification.reviewer
        ? {
            id: verification.reviewer.id,
            fullName: verification.reviewer.fullName,
          }
        : null,

      reviewNotes: verification.reviewNotes,
      rejectionReason: verification.rejectionReason,
      resubmissionReason: verification.resubmissionReason,
    };
  }

  private async mapDocuments(
    documents: VerificationDocumentRepositoryResponse[],
  ): Promise<VerificationDocumentsDTO> {
    const frontDocument = documents.find(
      (document) => document.side.code === 'front',
    );

    const backDocument = documents.find(
      (document) => document.side.code === 'back',
    );

    return {
      front: frontDocument ? await this.mapDocument(frontDocument) : null,
      back: backDocument ? await this.mapDocument(backDocument) : null,
    };
  }

  private async mapDocument(
    document: VerificationDocumentRepositoryResponse,
  ): Promise<VerificationDocumentItemDTO> {
    const imageUrl = await this._storageService.getSignedUrl(
      document.storageKey,
    );

    return {
      id: document.id,
      imageUrl,
      mimeType: document.mimeType,
    };
  }

  private mapAiAnalysis(
    verification: VerificationDetailsRepositoryResponse,
  ): VerificationAiAnalysisDTO {
    const summary =
      (verification.extractedData
        ?.analysisSummary as VerificationAiAnalysisDTO) ?? null;
    console.log('summery: ', summary);
    return {
      overallRiskScore: verification.ocrConfidence
        ? 100 - verification.ocrConfidence
        : null,

      overallRiskLevel: this.calculateRiskLevel(verification.overallRiskScore),

      ocrConfidence: verification.ocrConfidence,

      checks: (summary!.checks as VerificationAiCheckDTO[]) ?? [],
    };
  }
  private calculateRiskLevel(
    score: number | null,
  ): 'LOW' | 'MEDIUM' | 'HIGH' | null {
    if (score === null) {
      return null;
    }
    if (score >= 80) {
      return 'LOW';
    }
    if (score >= 50) {
      return 'MEDIUM';
    }
    return 'HIGH';
  }

  private mapExtractedData(
    extractedData: VerificationExtractedDataRepositoryResponse | null,
  ): VerificationExtractedDataDTO {
    if (!extractedData) {
      throw new Error('');
    }

    return {
      fullName: extractedData.fullName,
      documentNumber: extractedData.documentNumber,
      dateOfBirth: extractedData.dateOfBirth ?? null,
      nationality: extractedData.nationality,
      gender: extractedData.gender,
      issuingCountry: extractedData.issuingCountry,
    };
  }

  private mapTimeline(
    activities: VerificationActivityRepositoryResponse[],
  ): VerificationTimelineItemDTO[] {
    return activities.map((activity) => ({
      id: activity.id,
      title: activity.action.name,
      description: this.buildActivityDescription(activity),
      createdAt: activity.createdAt,
    }));
  }
  private buildActivityDescription(
    activity: VerificationActivityRepositoryResponse,
  ): string {
    const performedBy = activity.admin?.fullName;

    switch (activity.action.code) {
      case 'submitted':
        return 'Verification submitted by user.';

      case 'ocr_started':
        return 'OCR processing started.';

      case 'ocr_completed':
        return 'OCR processing completed successfully.';

      case 'under_review':
        return performedBy
          ? `Verification assigned to ${performedBy}.`
          : 'Verification moved to review.';

      case 'approved':
        return performedBy
          ? `Verification approved by ${performedBy}.`
          : 'Verification approved.';

      case 'rejected':
        return performedBy
          ? `Verification rejected by ${performedBy}.`
          : 'Verification rejected.';

      case 'resubmission_requested':
        return performedBy
          ? `Resubmission requested by ${performedBy}.`
          : 'Resubmission requested.';

      default:
        return activity.action.name;
    }
  }
}
