export interface GetDocVerificationResponseDTO {
  id: string;
  status: {
    code: string;
    name: string;
  };
  documentType: {
    code: string;
    name: string;
  };
  submittedAt: Date;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  resubmissionReason: string | null;
}
