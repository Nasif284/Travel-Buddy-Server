import { inject, injectable } from 'tsyringe';
import { ICreateSettlement } from '../../interfaces/use-cases/expense/settlement.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import { IExpenseRepository } from '../../interfaces/repositories/expense.repository';
import { CreateExpenseSettlementRequestDTO } from '../../dtos/expense/request/settlement.dto';
import { CreateExpenseSettlementResponseDTO } from '../../dtos/expense/response/settlement.dto';
@injectable()
export class CreateSettlement implements ICreateSettlement {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
  ) {}
  async execute(
    dto: CreateExpenseSettlementRequestDTO,
  ): Promise<CreateExpenseSettlementResponseDTO> {
    return await this._expenseRepository.createExpenseSettlement(dto);
  }
}
