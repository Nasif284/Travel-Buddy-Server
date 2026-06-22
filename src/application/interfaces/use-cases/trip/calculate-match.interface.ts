export interface ICalculateMatch {
  execute(dto: { tripId: string }): Promise<void>;
}
