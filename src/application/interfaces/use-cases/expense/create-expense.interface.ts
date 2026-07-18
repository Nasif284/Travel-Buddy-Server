import { CreateExpenseRequestDTO } from '../../../dtos/expense/request/create-expense.dto';
import { CreateExpenseResponseDTO } from '../../../dtos/expense/response/create-expense.dto';

export interface ICreateExpense {
  execute(payload: CreateExpenseRequestDTO): Promise<CreateExpenseResponseDTO>;
}
