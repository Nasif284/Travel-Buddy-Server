export interface ExpenseParticipantDTO {
  memberId: string;
  percentage?: number;
  amount?: number;
  shares?: number;
}

export interface CreateExpenseRequestDTO {
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  expenseDate?: Date;
  categoryCode: string;
  splitMethodCode: string;
  paidById: string;
  createdBy: string;
  participants: ExpenseParticipantDTO[];
}
