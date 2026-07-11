export interface IDeleteTrip {
  execute(dto: { tripId: string }): Promise<void>;
}
