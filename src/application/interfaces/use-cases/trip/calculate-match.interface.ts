export interface ICalculateMatch {
  execute(dto: { tripId: string; userId: string }): Promise<void>;
}
