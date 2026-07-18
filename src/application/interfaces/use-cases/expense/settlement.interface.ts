import { CreateExpenseSettlementRequestDTO } from '../../../dtos/expense/request/settlement.dto';
import { CreateExpenseSettlementResponseDTO } from '../../../dtos/expense/response/settlement.dto';

export interface ICreateSettlement {
  execute(
    dto: CreateExpenseSettlementRequestDTO,
  ): Promise<CreateExpenseSettlementResponseDTO>;
}
