export interface VerificationDocumentFileDTO {
  sideCode: string;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface SubmitVerificationRequestDTO {
  userId: string;
  documentTypeCode: string;
  uploadedDocuments: VerificationDocumentFileDTO[];
}
export interface SubmitVerificationRepositoryDTO {
  userId: string;
  documentTypeCode: string;

  documents: {
    sideCode: string;
    storageKey: string;
    mimeType: string;
    fileSize: number;
    width?: number;
    height?: number;
  }[];
}
