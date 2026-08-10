export interface SubmitVerificationResponseDTO {
  verificationId: string;
}
export interface Verification {
  id: string;
  userId: string;
  documentTypeCode: string;
  statusCode: string;
  assignedReviewerId: string;
}
