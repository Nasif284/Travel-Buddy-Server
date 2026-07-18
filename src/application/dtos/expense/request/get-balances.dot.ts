export enum ExpenseBalanceMode {
  ORIGINAL = 'ORIGINAL',
  SIMPLIFIED = 'SIMPLIFIED',
}

export interface GetExpenseBalancesRequestDTO {
  groupId: string;
  userId: string;
  mode: ExpenseBalanceMode;
}
