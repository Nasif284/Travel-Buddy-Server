export interface ExpenseReportResponseDTO {
  overall: ExpenseOverallReportDTO;
  categories: ExpenseCategoryReportDTO[];
  members: ExpenseMemberReportDTO[];
}
export interface ExpenseOverallReportDTO {
  totalExpenseAmount: number;
  averageExpensePerMember: number;
}
export interface ExpenseCategoryReportDTO {
  category: string;
  totalAmount: number;
  percentage: number;
}
export interface ExpenseMemberReportDTO {
  memberId: string;
  fullName: string;
  avatarUrl?: string | null;
  paid: number;
  owes: number;
  balance: number;
}
