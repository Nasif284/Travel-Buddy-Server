import { GetExpenseReportRequestDTO } from '../../../dtos/expense/request/get-report.dto';
import { ExpenseReportResponseDTO } from '../../../dtos/expense/response/get-report.dto';

export interface IGetExpenseReport {
  execute(
    payload: GetExpenseReportRequestDTO,
  ): Promise<ExpenseReportResponseDTO>;
}
