import {
  AnalyticsPeriod,
  AdminAnalyticsDTO,
} from '../../../dtos/admin-analytics/response/admin-analytics.dto';

export interface IAdminAnalyticsUseCase {
  execute(period: AnalyticsPeriod): Promise<AdminAnalyticsDTO>;
}
