import { GetExpensesRequestDTO } from '../../../dtos/expense/request/get-expenses,dto';
import { GetExpensesResponseDTO } from '../../../dtos/expense/response/get-expenses.dto';

export interface IGetExpenses {
  execute(dto: GetExpensesRequestDTO): Promise<GetExpensesResponseDTO>;
}
