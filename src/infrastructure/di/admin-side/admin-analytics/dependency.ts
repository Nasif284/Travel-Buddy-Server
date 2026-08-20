import { container } from 'tsyringe';
import { IAdminAnalyticsUseCase } from '../../../../application/interfaces/use-cases/admin-analytics/admin-analytics.interface';
import { TOKENS } from '../../tokens';
import { AdminAnalyticsUseCase } from '../../../../application/use-cases/admin-analytics/admin-analytics.usecase';

export function registerAdminAnalyticsDependency() {
  container.registerSingleton<IAdminAnalyticsUseCase>(
    TOKENS.IAdminAnalyticsUseCase,
    AdminAnalyticsUseCase,
  );
}
