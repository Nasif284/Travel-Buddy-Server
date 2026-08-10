import { VerificationDocumentFileDTO } from '../../dtos/profile/request/doc-verification.dto';

export interface IVerificationStorageService {
  uploadDocument(
    verificationId: string,
    sideCode: string,
    file: VerificationDocumentFileDTO,
  ): Promise<string>;

  deleteDocument(storageKey: string): Promise<void>;

  getSignedUrl(storageKey: string): Promise<string>;
}
