import { inject, injectable } from 'tsyringe';
import { CreateExpenseRequestDTO } from '../../dtos/expense/request/create-expense.dto';
import { CreateExpenseResponseDTO } from '../../dtos/expense/response/create-expense.dto';
import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { ICreateExpense } from '../../interfaces/use-cases/expense/create-expense.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';

@injectable()
export class CreateExpense implements ICreateExpense {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    payload: CreateExpenseRequestDTO,
  ): Promise<CreateExpenseResponseDTO> {
    return await this._expenseRepository.createExpense(payload);
  }
}
