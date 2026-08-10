export enum VerificationQueueTab {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface GetVerificationQueueRequestDTO {
  tab: VerificationQueueTab;
  page: number;
  limit: number;
  search?: string;
}
