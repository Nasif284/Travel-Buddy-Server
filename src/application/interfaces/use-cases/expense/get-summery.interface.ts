import { GetExpenseSummaryRequestDTO } from '../../../dtos/expense/request/get-summery.dto';
import { GetExpenseSummaryResponseDTO } from '../../../dtos/expense/response/get-summery.dto';

export interface IGetExpenseSummary {
  execute(
    payload: GetExpenseSummaryRequestDTO,
  ): Promise<GetExpenseSummaryResponseDTO>;
}
