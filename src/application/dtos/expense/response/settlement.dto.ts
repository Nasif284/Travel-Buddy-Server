export interface CreateExpenseSettlementResponseDTO {
  id: string;
  groupId: string;
  payerMemberId: string;
  receiverMemberId: string;
  amount: number;
  note?: string | null;
  settledAt: Date;
}
