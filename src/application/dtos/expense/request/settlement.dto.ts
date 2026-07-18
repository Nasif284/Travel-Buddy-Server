export interface CreateExpenseSettlementRequestDTO {
  groupId: string;
  payerMemberId: string;
  receiverMemberId: string;
  amount: number;
  note?: string;
}
