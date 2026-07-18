import { container } from 'tsyringe';
import { CreateExpense } from '../../../application/use-cases/expense/create-expense.usecase';
import { TOKENS } from '../tokens';
import { GetExpenses } from '../../../application/use-cases/expense/get-expenses.usecase';
import { UpdateExpense } from '../../../application/use-cases/expense/update-expense.usecase';
import { DeleteExpense } from '../../../application/use-cases/expense/delete-expense.usecase';
import { GetExpenseSummary } from '../../../application/use-cases/expense/get-summery.usecase';
import { GetExpenseBalances } from '../../../application/use-cases/expense/get-balances.usecase';
import { GetExpenseReport } from '../../../application/use-cases/expense/get-report.usecase';
import { CreateSettlement } from '../../../application/use-cases/expense/settlement.usecase';

export function registerExpenseDependency() {
  container.registerSingleton<CreateExpense>(
    TOKENS.ICreateExpense,
    CreateExpense,
  );
  container.registerSingleton<GetExpenses>(TOKENS.IGetExpenses, GetExpenses);
  container.registerSingleton<UpdateExpense>(
    TOKENS.IUpdateExpense,
    UpdateExpense,
  );
  container.registerSingleton<DeleteExpense>(
    TOKENS.IDeleteExpense,
    DeleteExpense,
  );
  container.registerSingleton<GetExpenseSummary>(
    TOKENS.IGetExpenseSummary,
    GetExpenseSummary,
  );
  container.registerSingleton<GetExpenseBalances>(
    TOKENS.IGetExpenseBalances,
    GetExpenseBalances,
  );
  container.registerSingleton<GetExpenseReport>(
    TOKENS.IGetExpensesReport,
    GetExpenseReport,
  );
  container.registerSingleton<CreateSettlement>(
    TOKENS.ICreateSettlement,
    CreateSettlement,
  );
}
