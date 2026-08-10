export const VerificationActivity = {
  SUBMITTED: 'submitted',
  REVIEW_STARTED: 'review_started',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMITTED: 'resubmitted',
} as const;
export const VerificationStatus = {
  PROCESSING: 'processing',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMISSION_REQUIRED: 'resubmission_required',
} as const;
