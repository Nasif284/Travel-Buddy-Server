export interface IDeactivateConnection {
  execute(dto: { connectionId: string }): Promise<void>;
}
