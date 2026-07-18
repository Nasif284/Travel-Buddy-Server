import { GetExpenseBalancesRequestDTO } from '../../../dtos/expense/request/get-balances.dot';
import { GetExpenseBalancesResponseDTO } from '../../../dtos/expense/response/get-balances.dto';

export interface IGetExpenseBalances {
  execute(
    payload: GetExpenseBalancesRequestDTO,
  ): Promise<GetExpenseBalancesResponseDTO>;
}
