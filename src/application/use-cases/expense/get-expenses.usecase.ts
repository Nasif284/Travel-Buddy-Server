import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';

import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { IGetExpenses } from '../../interfaces/use-cases/expense/get-expenses.interface';
import { GetExpensesRequestDTO } from '../../dtos/expense/request/get-expenses,dto';
import { GetExpensesResponseDTO } from '../../dtos/expense/response/get-expenses.dto';

@injectable()
export class GetExpenses implements IGetExpenses {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    payload: GetExpensesRequestDTO,
  ): Promise<GetExpensesResponseDTO> {
    return await this._expenseRepository.getExpenses(payload.groupId);
  }
}
