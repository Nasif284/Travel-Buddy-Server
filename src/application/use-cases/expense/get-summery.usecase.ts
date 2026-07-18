import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../../../infrastructure/di/tokens';
import { IGetExpenseSummary } from '../../interfaces/use-cases/expense/get-summery.interface';
import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { GetExpenseSummaryRequestDTO } from '../../dtos/expense/request/get-summery.dto';
import { GetExpenseSummaryResponseDTO } from '../../dtos/expense/response/get-summery.dto';

@injectable()
export class GetExpenseSummary implements IGetExpenseSummary {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    payload: GetExpenseSummaryRequestDTO,
  ): Promise<GetExpenseSummaryResponseDTO> {
    return await this._expenseRepository.getExpenseSummary(
      payload.groupId,
      payload.userId,
    );
  }
}
