import { CreateExpenseRequestDTO } from '../../dtos/expense/request/create-expense.dto';
import { CreateExpenseSettlementRequestDTO } from '../../dtos/expense/request/settlement.dto';
import { UpdateExpenseRequestDTO } from '../../dtos/expense/request/update-expense.dto';
import { CreateExpenseResponseDTO } from '../../dtos/expense/response/create-expense.dto';
import { GetExpensesResponseDTO } from '../../dtos/expense/response/get-expenses.dto';
import {
  ExpenseCategoryReportDTO,
  ExpenseOverallReportDTO,
} from '../../dtos/expense/response/get-report.dto';
import { GetExpenseSummaryResponseDTO } from '../../dtos/expense/response/get-summery.dto';
import { CreateExpenseSettlementResponseDTO } from '../../dtos/expense/response/settlement.dto';
export interface ExpenseBalanceData {
  members: {
    id: string;
    user: {
      fullName: string;
      avatarUrl: string | null;
    };
  }[];
  expenses: {
    paidById: string;
    amount: number;
    shares: {
      memberId: string;
      amount: number;
    }[];
  }[];
  settlements: {
    payerMemberId: string;
    receiverMemberId: string;
    amount: number;
  }[];
}
export interface IExpenseRepository {
  createExpense(
    payload: CreateExpenseRequestDTO,
  ): Promise<CreateExpenseResponseDTO>;
  getExpenses(groupId: string): Promise<GetExpensesResponseDTO>;
  updateExpense(payload: UpdateExpenseRequestDTO): Promise<void>;
  deleteExpense(expenseId: string): Promise<void>;
  getExpenseSummary(
    groupId: string,
    userId: string,
  ): Promise<GetExpenseSummaryResponseDTO>;
  getExpenseBalances(groupId: string): Promise<ExpenseBalanceData>;
  getExpenseReport(groupId: string): Promise<{
    overall: ExpenseOverallReportDTO;
    categories: ExpenseCategoryReportDTO[];
  }>;
  createExpenseSettlement(
    data: CreateExpenseSettlementRequestDTO,
  ): Promise<CreateExpenseSettlementResponseDTO>;
}
