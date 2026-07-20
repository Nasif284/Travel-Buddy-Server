export interface GetExpenseSummaryResponseDTO {
  totalExpenses: number;
  expenseCount: number;
  youPaid: number;
  youOwe: number;
  yourShare: number;
  youAreOwed: number;
  netBalance: number;
}
