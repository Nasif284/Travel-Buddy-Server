export interface IAcceptRequest {
  execute(dto: { requestId: string }): Promise<void>;
}
