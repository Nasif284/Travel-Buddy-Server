import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { DeleteExpenseRequestDTO } from '../../dtos/expense/request/delete-expense.dto';
import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { IDeleteExpense } from '../../interfaces/use-cases/expense/delete-expense.interface';

@injectable()
export class DeleteExpense implements IDeleteExpense {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}

  async execute(payload: DeleteExpenseRequestDTO): Promise<void> {
    await this._expenseRepository.deleteExpense(payload.expenseId);
  }
}
