import { inject, injectable } from 'tsyringe';
import { IGetExpenseReport } from '../../interfaces/use-cases/expense/get-report.interface';
import { TOKENS } from '../../../infrastructure/di/tokens';
import {
  ExpenseBalanceData,
  IExpenseRepository,
} from '../../interfaces/repositories/expense.repository';
import { GetExpenseReportRequestDTO } from '../../dtos/expense/request/get-report.dto';
import {
  ExpenseMemberReportDTO,
  ExpenseReportResponseDTO,
} from '../../dtos/expense/response/get-report.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetExpenseReport implements IGetExpenseReport {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}
  async execute(
    payload: GetExpenseReportRequestDTO,
  ): Promise<ExpenseReportResponseDTO> {
    const { expenses, members, settlements } =
      await this._expenseRepository.getExpenseBalances(payload.groupId);
    const balanceMap = await this.calculateBalances({
      members,
      expenses,
      settlements,
    });

    const { categories, overall } =
      await this._expenseRepository.getExpenseReport(payload.groupId);

    return {
      categories,
      overall,
      members: [...balanceMap.values()],
    };
  }
  private async calculateBalances(
    data: ExpenseBalanceData,
  ): Promise<Map<string, ExpenseMemberReportDTO>> {
    const { expenses, members, settlements } = data;
    const balanceMap = new Map<
      string,
      {
        memberId: string;
        fullName: string;
        avatarUrl: string | null;
        paid: number;
        owes: number;
        settlementPaid: number;
        settlementReceived: number;
        balance: number;
      }
    >();
    for (const member of members) {
      balanceMap.set(member.id, {
        memberId: member.id,
        fullName: member.user.fullName,
        avatarUrl: await this._storageService.getSignedUrl(
          member.user.avatarUrl!,
        ),
        paid: 0,
        owes: 0,
        settlementPaid: 0,
        settlementReceived: 0,
        balance: 0,
      });
    }
    for (const expense of expenses) {
      const payer = balanceMap.get(expense.paidById);
      if (payer) {
        payer.paid += Number(expense.amount);
      }
    }

    for (const expense of expenses) {
      for (const share of expense.shares) {
        const member = balanceMap.get(share.memberId);

        if (member) {
          member.owes += Number(share.amount);
        }
      }
    }
    for (const settlement of settlements) {
      const payer = balanceMap.get(settlement.payerMemberId);
      if (payer) {
        payer.settlementPaid += settlement.amount;
      }
      const receiver = balanceMap.get(settlement.receiverMemberId);
      if (receiver) {
        receiver.settlementReceived += settlement.amount;
      }
    }
    for (const member of balanceMap.values()) {
      member.balance =
        member.paid -
        member.owes +
        member.settlementPaid -
        member.settlementReceived;
    }

    return balanceMap;
  }
}
