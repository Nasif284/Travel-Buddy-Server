import { DeleteExpenseRequestDTO } from '../../../dtos/expense/request/delete-expense.dto';

export interface IDeleteExpense {
  execute(payload: DeleteExpenseRequestDTO): Promise<void>;
}
