export interface VerificationQueueItemDTO {
  verificationId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
  documentType: {
    code: string;
    name: string;
  };
  status: {
    code: string;
    name: string;
  };
  submittedAt: Date;
  assignedReviewer: {
    id: string;
    fullName: string;
  } | null;
}

export interface GetVerificationQueueResponseDTO {
  items: VerificationQueueItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
