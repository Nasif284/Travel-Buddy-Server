export interface IDeleteTask {
  execute(dto: { id: string }): Promise<void>;
}
