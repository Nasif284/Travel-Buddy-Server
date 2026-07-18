import { UpdateExpenseRequestDTO } from '../../../dtos/expense/request/update-expense.dto';

export interface IUpdateExpense {
  execute(payload: UpdateExpenseRequestDTO): Promise<void>;
}
