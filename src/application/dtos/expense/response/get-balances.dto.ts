export type ExpenseTransactionType = 'PAY' | 'RECEIVE';

export type ExpenseBalanceStatus = 'OWES' | 'GET_BACK' | 'SETTLED';

export interface ExpenseBalanceTransactionDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  amount: number;
  type: ExpenseTransactionType;
}

export interface ExpenseBalanceMemberDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  paid: number;
  owes: number;
  balance: number;
  status: ExpenseBalanceStatus;
  transactions: ExpenseBalanceTransactionDTO[];
}

export interface GetExpenseBalancesResponseDTO {
  members: ExpenseBalanceMemberDTO[];
}
