import { CreateExpenseRequestDTO } from './create-expense.dto';

export interface UpdateExpenseRequestDTO extends CreateExpenseRequestDTO {
  expenseId: string;
}
