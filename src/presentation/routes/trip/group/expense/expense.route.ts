import { Router } from 'express';
import { ExpenseController } from '../../../../controllers/trip/expense/expense.controller';
import { UserAuthMiddleware } from '../../../../middleware/user/auth/userAuth.middleware';

export function buildExpenseRoutes(
  controller: ExpenseController,
  userAuth: UserAuthMiddleware,
): Router {
  const router = Router({ mergeParams: true });
  router.post('/', userAuth.authenticate, controller.createExpense);
  router.get('/', userAuth.authenticate, controller.getExpenses);
  router.patch('/:expenseId', userAuth.authenticate, controller.updateExpense);
  router.delete('/:expenseId', userAuth.authenticate, controller.deleteExpense);
  router.get('/summery', userAuth.authenticate, controller.getExpenseSummary);
  router.get('/balances', userAuth.authenticate, controller.getExpenseBalances);
  router.get('/report', userAuth.authenticate, controller.getReport);
  router.post('/settle', userAuth.authenticate, controller.createSettlement);
  return router;
}
