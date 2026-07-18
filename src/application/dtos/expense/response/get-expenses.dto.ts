export interface ExpenseParticipantResponseDTO {
  memberId: string;
  name: string;
  amount: number;
  percentage: number | null;
  shares: number | null;
}

export interface ExpenseResponseDTO {
  id: string;
  title: string;
  description?: string | null;

  amount: number;

  expenseDate: Date;

  category: {
    code: string;
    name: string;
  };

  splitMethod: {
    code: string;
    name: string;
  };

  paidBy: {
    id: string;
    name: string;
  };

  participants: ExpenseParticipantResponseDTO[];
}

export interface GetExpensesResponseDTO {
  expenses: ExpenseResponseDTO[];
}
