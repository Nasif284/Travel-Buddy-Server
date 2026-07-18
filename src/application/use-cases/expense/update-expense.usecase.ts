import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { UpdateExpenseRequestDTO } from '../../dtos/expense/request/update-expense.dto';
import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { IUpdateExpense } from '../../interfaces/use-cases/expense/update-expense.interface';

@injectable()
export class UpdateExpense implements IUpdateExpense {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}

  async execute(payload: UpdateExpenseRequestDTO): Promise<void> {
    await await this._expenseRepository.updateExpense(payload);
  }
}
