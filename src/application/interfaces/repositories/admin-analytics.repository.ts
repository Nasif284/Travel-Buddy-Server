export interface IAdminAnalyticsRepository {
  getTotalUsers(): Promise<number>;
  getNewUsers(startDate: Date, endDate: Date): Promise<number>;
  getUserGrowth(
    startDate: Date,
    endDate: Date,
    interval: 'hour' | 'day' | 'month',
  ): Promise<
    {
      period: Date;
      count: number;
    }[]
  >;
  getUserAcquisition(
    startDate: Date,
    endDate: Date,
  ): Promise<
    {
      source: string;
      count: number;
    }[]
  >;
  getUsersByLocation(
    startDate: Date,
    endDate: Date,
  ): Promise<
    {
      countryCode: string;
      countryName: string;
      count: number;
    }[]
  >;
  getTotalTrips(): Promise<number>;
  getNewTrips(startDate: Date, endDate: Date): Promise<number>;
  getActiveTrips(today: Date): Promise<number>;
  getTopTripDestinations(
    startDate: Date,
    endDate: Date,
    limit: number,
  ): Promise<
    {
      destinationId: string;
      name: string;
      count: number;
    }[]
  >;
  getTotalConnections(): Promise<number>;
  getNewConnections(startDate: Date, endDate: Date): Promise<number>;
  getPendingVerifications(): Promise<number>;
}
