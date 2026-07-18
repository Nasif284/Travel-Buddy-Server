export interface ICompleteTask {
  execute(dto: { id: string }): Promise<void>;
}
