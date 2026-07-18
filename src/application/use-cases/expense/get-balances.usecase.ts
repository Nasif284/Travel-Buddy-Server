import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../infrastructure/di/tokens';
import {
  ExpenseBalanceData,
  IExpenseRepository,
} from '../../interfaces/repositories/expense.repository';
import { IGetExpenseBalances } from '../../interfaces/use-cases/expense/get-balances.interface';
import {
  ExpenseBalanceMode,
  GetExpenseBalancesRequestDTO,
} from '../../dtos/expense/request/get-balances.dot';
import {
  ExpenseBalanceMemberDTO,
  ExpenseBalanceStatus,
  ExpenseBalanceTransactionDTO,
  GetExpenseBalancesResponseDTO,
} from '../../dtos/expense/response/get-balances.dto';
import { IStorageService } from '../../interfaces/services/storage.service.interface';

@injectable()
export class GetExpenseBalances implements IGetExpenseBalances {
  constructor(
    @inject(TOKENS.IExpenseRepository)
    private readonly _expenseRepository: IExpenseRepository,
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,
  ) {}

  async execute(
    payload: GetExpenseBalancesRequestDTO,
  ): Promise<GetExpenseBalancesResponseDTO> {
    const { expenses, members, settlements } =
      await this._expenseRepository.getExpenseBalances(payload.groupId);
    const balanceMap = await this.calculateBalances({
      members,
      expenses,
      settlements,
    });

    if (payload.mode === ExpenseBalanceMode.ORIGINAL) {
      await this.buildOriginalDebtGraph(balanceMap, expenses);
    } else {
      await this.buildSimplifiedDebtGraph(balanceMap);
    }

    return {
      members: [...balanceMap.values()],
    };
  }
  private async calculateBalances(
    data: ExpenseBalanceData,
  ): Promise<Map<string, ExpenseBalanceMemberDTO>> {
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
        status: ExpenseBalanceStatus;
        transactions: ExpenseBalanceTransactionDTO[];
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
        status: 'SETTLED',
        transactions: [],
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
      if (member.balance > 0) {
        member.status = 'GET_BACK';
      } else if (member.balance < 0) {
        member.status = 'OWES';
      } else {
        member.status = 'SETTLED';
      }
    }
    return balanceMap;
  }
  private async buildOriginalDebtGraph(
    balanceMap: Map<string, ExpenseBalanceMemberDTO>,
    expenses: {
      paidById: string;
      shares: {
        memberId: string;
        amount: number;
      }[];
    }[],
  ): Promise<void> {
    const debtMap = new Map<string, number>();
    for (const expense of expenses) {
      for (const share of expense.shares) {
        if (share.memberId === expense.paidById) {
          continue;
        }
        const key = `${share.memberId}:${expense.paidById}`;
        const current = debtMap.get(key) ?? 0;
        debtMap.set(key, current + Number(share.amount));
      }
    }
    for (const [key, amount] of debtMap) {
      const [debtorId, creditorId] = key.split(':');

      const debtor = balanceMap.get(debtorId)!;
      const creditor = balanceMap.get(creditorId)!;
      const creditorAvatarUrl = await this._storageService.getSignedUrl(
        creditor.avatarUrl!,
      );
      const debtorAvatarUrl = await this._storageService.getSignedUrl(
        debtor.avatarUrl!,
      );
      debtor.transactions.push({
        memberId: creditor.memberId,
        fullName: creditor.fullName,
        avatarUrl: creditorAvatarUrl,
        amount,
        type: 'PAY',
      });

      creditor.transactions.push({
        memberId: debtor.memberId,
        fullName: debtor.fullName,
        avatarUrl: debtorAvatarUrl,
        amount,
        type: 'RECEIVE',
      });
    }
  }
  private async buildSimplifiedDebtGraph(
    balanceMap: Map<string, ExpenseBalanceMemberDTO>,
  ): Promise<void> {
    const creditors: ExpenseBalanceMemberDTO[] = [];
    const debtors: ExpenseBalanceMemberDTO[] = [];

    for (const member of balanceMap.values()) {
      member.transactions = [];

      if (member.balance > 0) {
        creditors.push(member);
      } else if (member.balance < 0) {
        debtors.push(member);
      }
    }

    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const creditorAmount = creditor.balance;
      const debtorAmount = Math.abs(debtor.balance);

      const settledAmount = Math.min(creditorAmount, debtorAmount);
      const creditorAvatarUrl = await this._storageService.getSignedUrl(
        creditor.avatarUrl!,
      );
      const debtorAvatarUrl = await this._storageService.getSignedUrl(
        debtor.avatarUrl!,
      );

      debtor.transactions.push({
        memberId: creditor.memberId,
        fullName: creditor.fullName,
        avatarUrl: creditorAvatarUrl,
        amount: settledAmount,
        type: 'PAY',
      });

      creditor.transactions.push({
        memberId: debtor.memberId,
        fullName: debtor.fullName,
        avatarUrl: debtorAvatarUrl,
        amount: settledAmount,
        type: 'RECEIVE',
      });

      creditor.balance -= settledAmount;
      debtor.balance += settledAmount;

      if (Math.abs(creditor.balance) < 0.01) {
        creditor.balance = 0;
        creditorIndex++;
      }

      if (Math.abs(debtor.balance) < 0.01) {
        debtor.balance = 0;
        debtorIndex++;
      }
    }
  }
}
