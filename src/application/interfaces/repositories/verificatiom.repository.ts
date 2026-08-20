import { SubmitVerificationRepositoryDTO } from '../../dtos/profile/request/doc-verification.dto';
import { Verification } from '../../dtos/profile/response/doc-verification.dto';
import { GetDocVerificationResponseDTO } from '../../dtos/profile/response/get-doc-verification.dto';
import { GetVerificationQueueRequestDTO } from '../../dtos/verifications/request/get-verification-queue.dto';
import {
  VerificationDetailsRepositoryResponse,
  VerificationProcessingProjection,
} from '../../dtos/verifications/response/get-verification-details.dto';
import { VerificationQueueItemDTO } from '../../dtos/verifications/response/get-verification-queue.dto';
import { OcrExtractionResult } from '../services/document-extraction.service.interface';
import { DocumentAnalysisResult } from '../services/doucment-analysis.service.interface';
export interface UpdateVerificationReviewRepositoryDTO {
  statusCode: string;
  reviewerId: string;
  rejectionReason?: string | null;
  resubmissionReason?: string | null;
  activityCode: string;
  reviewedAt: Date;
}
export interface UpdateVerificationAfterOcrRepositoryDTO {
  extraction: OcrExtractionResult;
  analysis: DocumentAnalysisResult;
}

export interface IVerificationRepository {
  submitVerification(
    data: SubmitVerificationRepositoryDTO,
  ): Promise<Verification>;
  getMyVerification(
    userId: string,
  ): Promise<GetDocVerificationResponseDTO | null>;
  getVerificationQueue(dto: GetVerificationQueueRequestDTO): Promise<{
    items: VerificationQueueItemDTO[];
    total: number;
  }>;
  getVerificationDetails(
    verificationId: string,
  ): Promise<VerificationDetailsRepositoryResponse | null>;
  getVerificationForProcessing(
    verificationId: string,
  ): Promise<VerificationProcessingProjection | null>;
  updateVerificationAfterOcr(
    verificationId: string,
    data: UpdateVerificationAfterOcrRepositoryDTO,
  ): Promise<void>;
  updateVerificationReview(
    verificationId: string,
    dto: UpdateVerificationReviewRepositoryDTO,
  ): Promise<void>;
  getVerificationDocuments(
    userId: string,
  ): Promise<{ side: string; storageKey: string }[] | null>;
}
