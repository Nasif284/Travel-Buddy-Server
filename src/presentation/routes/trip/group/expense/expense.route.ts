import { Router } from 'express';
import { ExpenseController } from '../../../../controllers/trip/expense/expense.controller';
import { authenticate } from '../../../../middleware/user/auth/userAuth.middleware';

export function buildExpenseRoutes(controller: ExpenseController): Router {
  const router = Router({ mergeParams: true });
  router.post('/', authenticate, controller.createExpense);
  router.get('/', authenticate, controller.getExpenses);
  router.patch('/:expenseId', authenticate, controller.updateExpense);
  router.delete('/:expenseId', authenticate, controller.deleteExpense);
  router.post('/summery', authenticate, controller.getExpenseSummary);
  router.get('/balances', authenticate, controller.getExpenseBalances);
  router.get('/report', authenticate, controller.getReport);
  router.post('/settle', authenticate, controller.createSettlement);
  return router;
}
