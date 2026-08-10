export interface GetVerificationDetailsResponseDTO {
  verificationId: string;
  user: VerificationUserDTO;
  verification: VerificationSummaryDTO;
  documents: VerificationDocumentsDTO;
  aiAnalysis: VerificationAiAnalysisDTO;
  extractedData: VerificationExtractedDataDTO;
  timeline: VerificationTimelineItemDTO[];
}
export interface VerificationDocumentsDTO {
  front: VerificationDocumentItemDTO | null;
  back: VerificationDocumentItemDTO | null;
}
export interface VerificationUserDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  joinedAt: Date;
  accountAgeInDays: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  country: string | null;
}
export interface VerificationSummaryDTO {
  status: {
    code: string;
    name: string;
  };
  documentType: {
    code: string;
    name: string;
  };
  submittedAt: Date;
  reviewStartedAt: Date | null;
  reviewedAt: Date | null;
  reviewer: {
    id: string;
    fullName: string;
  } | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
  resubmissionReason: string | null;
}
export interface VerificationDocumentItemDTO {
  id: string;
  imageUrl: string;
  mimeType: string;
}
export interface VerificationAiAnalysisDTO {
  overallRiskScore: number | null;
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  ocrConfidence: number | null;
  checks: VerificationAiCheckDTO[];
}
export interface VerificationAiCheckDTO {
  title: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  message: string;
  confidence?: number;
}
export interface VerificationExtractedDataDTO {
  fullName?: string | null;
  documentNumber?: string | null;
  nationality?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  issuingCountry?: string | null;
}
export interface VerificationTimelineItemDTO {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export interface VerificationExtractedDataRepositoryResponse {
  fullName: string | null;
  dateOfBirth: Date | null;
  documentNumber: string | null;
  nationality: string | null;
  gender: string | null;
  issuingCountry: string | null;
  analysisSummary: unknown | null;
}

export interface VerificationDocumentRepositoryResponse {
  id: string;
  storageKey: string;
  mimeType: string;
  width: number | null;
  height: number | null;

  side: {
    code: string;
  };
}

export interface VerificationActivityRepositoryResponse {
  id: string;
  createdAt: Date;

  action: {
    code: string;
    name: string;
  };

  admin: {
    fullName: string;
  } | null;
}
export interface VerificationDetailsRepositoryResponse {
  id: string;

  overallRiskScore: number | null;
  ocrConfidence: number | null;
  reviewStartedAt: Date | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
  resubmissionReason: string | null;

  submittedAt: Date;

  status: {
    code: string;
    name: string;
  };

  documentType: {
    code: string;
    name: string;
  };

  reviewer: {
    id: string;
    fullName: string;
  } | null;

  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;

    createdAt: Date;

    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isIdVerified: boolean;

    country: {
      name: string;
    } | null;
  };

  documents: VerificationDocumentRepositoryResponse[];
  extractedData: VerificationExtractedDataRepositoryResponse | null;
  activities: VerificationActivityRepositoryResponse[];
}

export interface VerificationProcessingProjection {
  id: string;
  statusCode: string;
  documentTypeCode: string;

  documents: {
    id: string;
    sideCode: string;
    storageKey: string;
    mimeType: string;
  }[];
}
