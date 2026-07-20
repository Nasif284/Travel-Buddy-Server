import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../../infrastructure/di/tokens';
import { ICreateExpense } from '../../../../application/interfaces/use-cases/expense/create-expense.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../../domain/enums/HttpStatusCodes.constants';
import { ApiResponse } from '../../../responses/common-response';
import { EXPENSE_MESSAGES } from '../../../../shared/constants/messages/success/trip/expense.messages';
import { IGetExpenses } from '../../../../application/interfaces/use-cases/expense/get-expenses.interface';
import { IUpdateExpense } from '../../../../application/interfaces/use-cases/expense/update-expense.interface';
import { IDeleteExpense } from '../../../../application/interfaces/use-cases/expense/delete-expense.interface';
import { IGetExpenseSummary } from '../../../../application/interfaces/use-cases/expense/get-summery.interface';
import { IGetExpenseBalances } from '../../../../application/interfaces/use-cases/expense/get-balances.interface';
import { ExpenseBalanceMode } from '../../../../application/dtos/expense/request/get-balances.dot';
import { IGetExpenseReport } from '../../../../application/interfaces/use-cases/expense/get-report.interface';
import { ICreateSettlement } from '../../../../application/interfaces/use-cases/expense/settlement.interface';
@injectable()
export class ExpenseController {
  constructor(
    @inject(TOKENS.ICreateExpense)
    private readonly _createExpense: ICreateExpense,
    @inject(TOKENS.IGetExpenses) private readonly _getExpenses: IGetExpenses,
    @inject(TOKENS.IUpdateExpense)
    private readonly _updateExpense: IUpdateExpense,
    @inject(TOKENS.IDeleteExpense)
    private readonly _deleteExpense: IDeleteExpense,
    @inject(TOKENS.IGetExpenseSummary)
    private readonly _getExpenseSummary: IGetExpenseSummary,
    @inject(TOKENS.IGetExpenseBalances)
    private readonly _getExpenseBalances: IGetExpenseBalances,
    @inject(TOKENS.IGetExpensesReport)
    private readonly _getExpenseReport: IGetExpenseReport,
    @inject(TOKENS.ICreateSettlement)
    private readonly _createSettlement: ICreateSettlement,
  ) {}
  createExpense = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = req.user?.userId;
    console.log(req.body);
    const data = await this._createExpense.execute({
      ...req.body,
      groupId: id,
      createdBy: userId,
      expenseDate: new Date(),
    });
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(EXPENSE_MESSAGES.CREATED, data));
  };
  getExpenses = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const data = await this._getExpenses.execute({ groupId: id as string });
    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.FETCHED, data));
  };
  updateExpense = async (req: Request, res: Response): Promise<Response> => {
    const { id, expenseId } = req.params;

    const userId = req.user!.userId;

    await this._updateExpense.execute({
      ...req.body,
      groupId: id,
      expenseId,
      createdBy: userId,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.UPDATED));
  };
  deleteExpense = async (req: Request, res: Response): Promise<Response> => {
    const { expenseId } = req.params;
    await this._deleteExpense.execute({
      expenseId: expenseId as string,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.DELETED));
  };
  getExpenseSummary = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { id } = req.params;

    const userId = req.user!.userId;

    const data = await this._getExpenseSummary.execute({
      groupId: id as string,
      userId,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.FETCHED_SUMMERY, data));
  };
  getExpenseBalances = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { id } = req.params;

    const userId = req.user!.userId;

    const mode =
      req.query.mode === ExpenseBalanceMode.SIMPLIFIED
        ? ExpenseBalanceMode.SIMPLIFIED
        : ExpenseBalanceMode.ORIGINAL;

    const data = await this._getExpenseBalances.execute({
      groupId: id as string,
      userId,
      mode,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.FETCHED_BALANCES, data));
  };
  getReport = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const data = await this._getExpenseReport.execute({
      groupId: id as string,
      userId,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.FETCHED_BALANCES, data));
  };
  createSettlement = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const data = await this._createSettlement.execute({
      ...req.body,
      groupId: id as string,
      payerMemberId: userId!,
    });

    return res
      .status(HttpStatus.OK)
      .json(ApiResponse.success(EXPENSE_MESSAGES.SETTLEMENT_CREATED, data));
  };
}
