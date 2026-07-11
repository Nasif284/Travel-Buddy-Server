export interface IWithdrawRequest {
  execute(dto: { requestId: string }): Promise<void>;
}
