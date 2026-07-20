import { inject, injectable } from 'tsyringe';
import {
  ExpenseBalanceData,
  IExpenseRepository,
} from '../../../application/interfaces/repositories/expense.repository';
import { BaseRepository } from './base.repository';

import { Expense, Prisma } from '@prisma/client';
import { TOKENS } from '../../di/tokens';
import { PrismaClient } from '@prisma/client/extension';
import { CreateExpenseRequestDTO } from '../../../application/dtos/expense/request/create-expense.dto';
import { CreateExpenseResponseDTO } from '../../../application/dtos/expense/response/create-expense.dto';
import { calculateExpenseShares } from '../../../shared/helpers/calculateSplit';
import { GetExpensesResponseDTO } from '../../../application/dtos/expense/response/get-expenses.dto';
import { UpdateExpenseRequestDTO } from '../../../application/dtos/expense/request/update-expense.dto';
import { GetExpenseSummaryResponseDTO } from '../../../application/dtos/expense/response/get-summery.dto';
import { ExpenseBalanceMode } from '../../../application/dtos/expense/request/get-balances.dot';
import {
  ExpenseCategoryReportDTO,
  ExpenseOverallReportDTO,
} from '../../../application/dtos/expense/response/get-report.dto';
import { CreateExpenseSettlementRequestDTO } from '../../../application/dtos/expense/request/settlement.dto';
import { CreateExpenseSettlementResponseDTO } from '../../../application/dtos/expense/response/settlement.dto';

@injectable()
export class ExpenseRepository
  extends BaseRepository<
    Expense,
    Prisma.ExpenseCreateInput,
    Prisma.ExpenseUpdateInput
  >
  implements IExpenseRepository
{
  constructor(@inject(TOKENS.PrismaClient) prisma: PrismaClient) {
    super(prisma, prisma.expense);
  }
  async createExpense(
    payload: CreateExpenseRequestDTO,
  ): Promise<CreateExpenseResponseDTO> {
    return await this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          groupId: payload.groupId,
          title: payload.title,
          description: payload.description,
          amount: payload.amount,
          expenseDate: payload.expenseDate!,
          categoryCode: payload.categoryCode,
          splitMethodCode: payload.splitMethodCode,
          paidById: payload.paidById,
          createdBy: payload.createdBy,
        },
      });
      const shares = calculateExpenseShares(payload);

      await tx.expenseShare.createMany({
        data: shares.map((share) => ({
          ...share,
          expenseId: expense.id,
          paidById: payload.paidById,
        })),
      });

      await tx.expenseActivity.create({
        data: {
          expenseId: expense.id,
          userId: payload.createdBy,
          actionCode: 'CREATED',
        },
      });

      return {
        id: expense.id,
      };
    });
  }

  async getExpenses(groupId: string): Promise<GetExpensesResponseDTO> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        groupId,
      },
      orderBy: {
        expenseDate: 'desc',
      },
      include: {
        category: true,

        splitMethod: true,

        paidBy: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },

        shares: {
          include: {
            member: {
              include: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      expenses: expenses.map((expense) => ({
        id: expense.id,
        title: expense.title,
        description: expense.description,
        amount: Number(expense.amount),
        expenseDate: expense.expenseDate,

        category: {
          code: expense.category.code,
          name: expense.category.name,
        },

        splitMethod: {
          code: expense.splitMethod.code,
          name: expense.splitMethod.name,
        },

        paidBy: {
          id: expense.paidBy.id,
          name: expense.paidBy.user.fullName,
        },

        participants: expense.shares.map((share) => ({
          memberId: share.member.id,
          name: share.member.user.fullName,
          amount: Number(share.amount),
          percentage: share.percentage && Number(share.percentage),
          shares: share.shares && Number(share.shares),
        })),
      })),
    };
  }
  async updateExpense(payload: UpdateExpenseRequestDTO): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.expense.update({
        where: {
          id: payload.expenseId,
        },
        data: {
          title: payload.title,
          amount: payload.amount,
          expenseDate: payload.expenseDate,
          categoryCode: payload.categoryCode,
          splitMethodCode: payload.splitMethodCode,
          paidById: payload.paidById,
        },
      });

      await tx.expenseShare.deleteMany({
        where: {
          expenseId: payload.expenseId,
        },
      });

      const shares = calculateExpenseShares(payload);

      await tx.expenseShare.createMany({
        data: shares.map((share) => ({
          expenseId: payload.expenseId,
          paidById: payload.paidById,
          ...share,
        })),
      });

      await tx.expenseActivity.create({
        data: {
          expenseId: payload.expenseId,
          userId: payload.createdBy,
          actionCode: 'UPDATED',
        },
      });
    });
  }
  async deleteExpense(expenseId: string): Promise<void> {
    await this.prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });
  }
  async getExpenseSummary(
    groupId: string,
    userId: string,
  ): Promise<GetExpenseSummaryResponseDTO> {
    const member = await this.prisma.tripGroupMember.findFirst({
      where: {
        groupId,
        userId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      throw new Error('Group member not found');
    }

    const [expenseAggregate, paidAggregate, shareAggregate, oweAggregate] =
      await this.prisma.$transaction([
        this.prisma.expense.aggregate({
          where: {
            groupId,
          },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        }),

        this.prisma.expense.aggregate({
          where: {
            groupId,
            paidById: member.id,
          },
          _sum: {
            amount: true,
          },
        }),

        this.prisma.expenseShare.aggregate({
          where: {
            expense: {
              groupId,
            },
            memberId: member.id,
            paidById: { not: member.id },
          },
          _sum: {
            amount: true,
          },
        }),

        this.prisma.expenseShare.aggregate({
          where: {
            expense: {
              groupId,
            },
            memberId: member.id,
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    const totalExpenses = Number(expenseAggregate._sum.amount ?? 0);
    const expenseCount = expenseAggregate._count.id;

    const youPaid = Number(paidAggregate._sum.amount ?? 0);
    const youOwe = Number(oweAggregate._sum.amount ?? 0);
    const yourShare = Number(shareAggregate._sum.amount ?? 0);

    const netBalance = youPaid - youOwe;

    return {
      totalExpenses,
      expenseCount,
      youPaid,
      youOwe,
      yourShare,
      youAreOwed: Math.max(netBalance, 0),
      netBalance,
    };
  }
  async getExpenseBalances(groupId: string): Promise<ExpenseBalanceData> {
    const [members, expenses, settlements] = await this.prisma.$transaction([
      this.prisma.tripGroupMember.findMany({
        where: {
          groupId,
          isActive: true,
        },
        select: {
          id: true,
          user: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      }),

      this.prisma.expense.findMany({
        where: {
          groupId,
        },
        include: {
          shares: {
            select: {
              memberId: true,
              amount: true,
            },
          },
        },
      }),
      this.prisma.expenseSettlement.findMany({
        where: {
          groupId,
        },
        select: {
          payerMemberId: true,
          receiverMemberId: true,
          amount: true,
        },
      }),
    ]);

    return {
      members,
      expenses: expenses.map((e) => ({
        ...e,
        amount: Number(e.amount),
        shares: e.shares.map((s) => ({
          ...s,
          amount: Number(s.amount),
        })),
      })),
      settlements: settlements.map((s) => ({
        ...s,
        amount: Number(s.amount),
      })),
    };
  }
  async getExpenseReport(groupId: string): Promise<{
    overall: ExpenseOverallReportDTO;
    categories: ExpenseCategoryReportDTO[];
  }> {
    const [overallResult, categoryResult] = await this.prisma.$transaction([
      this.prisma.expense.aggregate({
        where: {
          groupId,
        },
        _sum: {
          amount: true,
        },
      }),

      this.prisma.expense.groupBy({
        by: ['categoryCode'],
        where: {
          groupId,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalExpenseAmount = Number(overallResult._sum.amount ?? 0);

    const memberCount = await this.prisma.tripGroupMember.count({
      where: {
        groupId,
        isActive: true,
      },
    });

    const overall: ExpenseOverallReportDTO = {
      totalExpenseAmount,
      averageExpensePerMember:
        memberCount === 0 ? 0 : totalExpenseAmount / memberCount,
    };

    const categories: ExpenseCategoryReportDTO[] = categoryResult.map(
      (category) => ({
        category: category.categoryCode,
        totalAmount: Number(category._sum.amount ?? 0),
        percentage:
          totalExpenseAmount === 0
            ? 0
            : (Number(category._sum.amount ?? 0) / totalExpenseAmount) * 100,
      }),
    );

    return {
      overall,
      categories,
    };
  }

  async createExpenseSettlement(
    data: CreateExpenseSettlementRequestDTO,
  ): Promise<CreateExpenseSettlementResponseDTO> {
    const settlement = await this.prisma.expenseSettlement.create({
      data: {
        groupId: data.groupId,
        payerMemberId: data.payerMemberId,
        receiverMemberId: data.receiverMemberId,
        amount: data.amount,
        note: data.note,
      },
    });

    return {
      id: settlement.id,
      groupId: settlement.groupId,
      payerMemberId: settlement.payerMemberId,
      receiverMemberId: settlement.receiverMemberId,
      amount: Number(settlement.amount),
      note: settlement.note,
      settledAt: settlement.settledAt,
    };
  }
}
