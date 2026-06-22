export interface IRejectRequest {
  execute(dto: { requestId: string }): Promise<void>;
}
