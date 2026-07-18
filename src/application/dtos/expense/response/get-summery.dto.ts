export interface GetExpenseSummaryResponseDTO {
  totalExpenses: number;
  expenseCount: number;
  youPaid: number;
  youOwe: number;
  youAreOwed: number;
  netBalance: number;
}
