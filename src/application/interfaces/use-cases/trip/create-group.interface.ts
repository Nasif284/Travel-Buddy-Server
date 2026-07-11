export interface ICreateGroup {
  execute(dto: { tripId: string; userId: string }): Promise<void>;
}
